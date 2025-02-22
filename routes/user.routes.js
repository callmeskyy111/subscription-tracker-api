import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Fetched all users successfully ✅" });
});

userRouter.get("/:id", (req, res) => {
  //const userId = req.params.id;
  res
    .status(200)
    .json({ success: true, message: `Fetched user successfully ✅` });
});

userRouter.post("/", (req, res) => {
  //const newUser = req.body;
  res
    .status(201)
    .json({ success: true, message: "Created new user successfully ✅" });
});

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
