const UserModel = require("../Model/UserModel");
const bcrypt = require("bcryptjs");

const getUserProfile = async (req, res) => {
  try {
    // FIX 1: Look for _id instead of id
    const user = await UserModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // FIX 1: Look for _id instead of id
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // FIX 2: Change username to fullname to match your database schema
    user.fullname = req.body.fullname || user.fullname;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullname: updatedUser.fullname, // Return fullname
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };
