import UserModel from "../models/user.model.js";

export async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully ✅",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
   
  }
}

export async function getUserById(req, res, next) {
    try{
        const user = await UserModel.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found 🔴" });
        };
        return res.status(200).json({ success: true, message: "User fetched successfully ✅", data: user });

    }catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
      
    }
}