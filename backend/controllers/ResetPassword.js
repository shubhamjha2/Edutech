// Import necessary modules
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Load environment variables
require('dotenv').config();

// Function to generate a random token
const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `This email (${email}) is not registered with us. Please enter a valid email.`,
      });
    }

    const token = generateToken();
    user.token = token;
    user.resetPasswordExpires = Date.now() + parseInt(process.env.RESET_TOKEN_EXPIRATION || 3600000); // Set token expiration time from environment variable or default to 1 hour

    await user.save();

    const resetUrl = `${process.env.RESET_URL}/${token}`;
    await mailSender(
      email,
      "Password Reset",
      `Your password reset link is: ${resetUrl}. Please click this link to reset your password.`
    );

    res.json({
      success: true,
      message: "Email sent successfully. Please check your email to continue.",
    });
  } catch (error) {
    console.error("Error in resetPasswordToken:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the reset email.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match.",
      });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token is expired. Please regenerate your token.",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;
    user.token = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password.",
    });
  }
};
