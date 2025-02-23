import express from "express";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";

//importing routers
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

//connect to MongoDB database
import connectDB from "./database/connectDB.js";

//importing middlewares
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

//endpoints
app.use("/api/v1/auth", authRouter); //! endpoint: /api/v1/auth/sign-up
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

//Global Error-Handler Middleware
app.use(errorMiddleware);

app.get("/", (_, res) => {
  res.send("<h2>Subscription API Working ✅</h2>");
});

app.listen(PORT, async () => {
  console.log(`Listening on ${PORT}.. 🛜`);
  await connectDB();
});
