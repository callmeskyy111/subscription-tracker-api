import express from "express";
import { PORT } from "./config/env.js";

//importing routers
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

//connect to MongoDB database
import connectDB from "./database/connectDB.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//endpoints
app.use("/api/v1/auth", authRouter); //! endpoint: /api/v1/auth/sign-up
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

//Global Error-Handler Middleware
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("<h2>Subscription API Working ✅</h2>");
});

app.listen(PORT, async () => {
  console.log(`listening on ${PORT}.. 🛜`);
  await connectDB();
});
