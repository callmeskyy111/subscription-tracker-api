import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Fetch/GET all subscriptions ✅" });
});

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
  //const { id } = req.params;
  res
    .status(200)
    .json({ success: true, message: `Update/PUT subscription with ID --- ✅` });
});

subscriptionRouter.delete("/:id", (req, res) => {
  //const { id } = req.params;
  res
    .status(200)
    .json({ success: true, message: `DELETE subscription with ID --- ✅` });
});

// Fetch subscriptions for a PARTICULAR USER
subscriptionRouter.get("/user/:id", (req, res) => {
  //const { id } = req.params;
  res.status(200).json({
    success: true,
    message: `Fetch/GET subscriptions for user with ID --- ✅`,
  });
});

// Cancel a PARTICULAR USER's subsription

subscriptionRouter.put("/:id/cancel", (req, res) => {
  //const { id } = req.params;
  res
    .status(200)
    .json({ success: true, message: `Cancel/PUT subscription with ID --- ✅` });
});

// Fetch upcoming subscriptions/renewals
subscriptionRouter.get("/upcoming", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fetch/GET upcoming subscriptions/renewals ✅",
  });
});

export default subscriptionRouter;
