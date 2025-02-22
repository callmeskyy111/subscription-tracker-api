import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Missing DB_URI environment variable inside .env<development/production>.local ⚠️"
  );
}

async function connectDB() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB successfully ☑️");
  } catch (error) {
    console.error("🔴 Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

export default connectDB;
