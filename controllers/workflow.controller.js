// controllers/workflow.controller.js
import { createRequire } from "module";
import SubscriptionModel from "../models/subscription.model.js";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  console.log("Triggered workflow for subscription:", subscriptionId);

  const subscription = await fetchSubscription(context, subscriptionId);
  console.log("Fetched subscription:", subscription);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);
  console.log(
    "Renewal date:",
    renewalDate.format(),
    "Current date:",
    dayjs().format()
  );

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for: ${subscriptionId}. Stopping workflow`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    console.log(
      `Checking reminder ${daysBefore} days before: ${reminderDate.format()}`
    );

    if (reminderDate.isAfter(dayjs())) {
      console.log(
        `Calling sleepUntil for ${daysBefore}-day reminder at ${reminderDate.format()}`
      );
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days`,
        reminderDate
      );
    }

    if (dayjs().isSame(reminderDate, "day")) {
      console.log(`Triggering reminder for ${daysBefore} days before renewal`);
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription
      );
    }
  }
});

// Fetch subscription details
async function fetchSubscription(context, subscriptionId) {
  return await context.run("get subscription", async () => {
    return SubscriptionModel.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
}

// Sleep until the reminder date
async function sleepUntilReminder(context, label, date) {
  console.log(`Sleeping until ${label} reminder at ${date.format()}`);
  await context.sleepUntil(label, date.toDate());
}

// Trigger the reminder action
async function triggerReminder(context, label, subscription) {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    //todo: Send email, text, SMS, push notification, etc.
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
}
