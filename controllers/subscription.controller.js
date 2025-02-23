import { SERVER_URL } from "../config/env.js";
import { workFlowClient } from "../config/upstash.js";
import SubscriptionModel from "../models/subscription.model.js";

// Create Subscription
export async function createSubscription(req, res) {
  try {
    const subscription = await SubscriptionModel.create({
      ...req.body,
      user: req.user._id, // coming from auth(), not the body
    });
    const { workflowRunId } = await workFlowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscriptions/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });
    res.status(201).json({
      success: true,
      message: "Subscription created ✅",
      data: { subscription, workflowRunId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get User Subscriptions
export async function getUserSubscriptions(req, res) {
  try {
    // Ensure the user requesting matches the token user
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "You are not the owner of this account ❌",
      });
    }

    const subscriptions = await SubscriptionModel.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: `Fetched subscriptions for user with ID - ${req.params.id} ✅`,
      totalSubscriptions: subscriptions.length,
      data: subscriptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}
