import aj from "../config/arcjet.js";

async function arcjetMiddleware(req, res, next) {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      // Checking for rate limit
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ success: false, message: "Rate Limit Exceeded 🔴" });
      }
      // Checking for bots
      if (decision.reason.isBot()) {
        return res
          .status(403)
          .json({ success: false, message: "Bot detected 🤖⚠️" });
      }
      // Default denial case
      return res
        .status(403)
        .json({ success: false, message: "Access Denied 🔴" });
    }

    next();
  } catch (error) {
    console.error(`🔴 Arcjet Middleware Error: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
}

export default arcjetMiddleware;
