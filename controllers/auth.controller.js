import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export async function signUp(req, res, next) {
  const session = await mongoose.startSession(); //session of a mongoose-transaction / atomic updates
  session.startTransaction(); //start a new transaction
  try {
    const { name, email, password } = req.body;
    // Check if the user already exists or not
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists ⚠️" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await UserModel.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );
    // token generation
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await session.commitTransaction();
    session.endSession(); //end the session

    res.status(201).json({
      success: true,
      message: "User Created Successfully ✅",
      data: {
        token,
        user: newUser[0],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
    await session.abortTransaction(); //if any error, abort the transaction
    session.endSession();
    next(error);
  }
}

export async function signIn(req, res, next) {}

export async function signOut(req, res, next) {}
