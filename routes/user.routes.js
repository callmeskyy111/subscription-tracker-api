import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:id", authorize, getUserById);

userRouter.post("/");

userRouter.put("/:id", (req, res) => {
  //const userId = req.params.id;
  //const updatedUser = req.body;
  res
    .status(200)
    .json({ success: true, message: "Updated user successfully ✅" });
});

userRouter.delete("/:id", (req, res) => {
  //const userId = req.params.id;
  res
    .status(200)
    .json({ success: true, message: "Deleted user successfully ✅" });
});

export default userRouter;
