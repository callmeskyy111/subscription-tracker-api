import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import UserModel from "../models/user.model.js";

async function authorize(req, res, next) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") // Bearer - protocol/recommeded method
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized 🔴" });
    }
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ success: false, message: "Forbidden 🔴" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access 🔴",
      error: err.message,
    });
  }
}

export default authorize;
