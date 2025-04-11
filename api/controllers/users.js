const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require("bcryptjs");

async function create(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const fullName = req.body.fullName;
    const profilePicture =
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
    const bio = req.body.bio;

    if (!email || !password || !username) {
      throw new Error("Email, password and username are required");
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      throw new Error("Email is already in use");
    }

    const existingUserUserName = await User.findOne({ username });
    if (existingUserUserName) {
      throw new Error("Username is already in use");
    }

    const user = new User({
      email,
      password,
      username,
      fullName,
      profilePicture,
      bio,
    });
    await user.save();

    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.error("Error caught:", err);

    // other errors
    return res.status(400).json({ message: err.message });
  }
}

async function getUser(req, res) {
  try {
    const foundUser = await User.findOne({ _id: req.user_id });
    const token = generateToken(req.user_id);
    res.status(200).json({
      userId: foundUser._id,
      username: foundUser.username,
      profilePicture: foundUser.profilePicture,
      token: token,
      dateCreated: foundUser.dateCreated,
      email: foundUser.email,
    });
  } catch (err) {
    return res.status(400).json({ message: "User not found" });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user_id;
    const { username, email, password, fullName, profilePicture, bio } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const update = {};

    if (username) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (username.length < 3 || username.length > 20) {
        return res
          .status(400)
          .json({ message: "Username must be between 3 and 20 characters" });
      }
      if (!usernameRegex.test(username)) {
        return res
          .status(400)
          .json({
            message:
              "Username can only contain letters, numbers, and underscores",
          });
      }

      const existingUserName = await User.findOne({ username });
      if (existingUserName && existingUserName._id.toString() !== userId) {
        return res.status(400).json({ message: "Username is already in use" });
      }
      update.username = username;
    }

    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid email address" });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      update.email = email;
    }

    if (password) {
      const { currentPassword, password: newPassword } = req.body;

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message:
            "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character",
        });
      }

      user.password = newPassword;
    }

    if (fullName) update.fullName = fullName;
    if (profilePicture) update.profilePicture = profilePicture;
    if (bio) update.bio = bio;

    Object.assign(user, update);

    const updatedUser = await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
      },
    });
  } catch (err) {
    console.error("Error caught:", err);
    return res.status(400).json({ message: err.message });
    console.error("Error caught:", err);
    return res.status(400).json({ message: err.message });
  }
}

const deleteUser = async (req, res) => {
  try {
    const userId = req.user_id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error caught:", err);
    return res.status(400).json({ message: err.message });
  }
};

const UsersController = {
  create: create,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};

module.exports = UsersController;
