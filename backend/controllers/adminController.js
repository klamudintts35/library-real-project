import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";
import sendOtp from "../utils/sendOtp.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with email or mobile",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Register failed",
      error: error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/mobile and password are required",
      });
    }

    const admin = await Admin.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password -otp -otpExpiry");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const admin = await Admin.findOne({ mobile });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found with this mobile number",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await admin.save();

    await sendOtp(mobile, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile and OTP are required",
      });
    }

    const admin = await Admin.findOne({ mobile });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!admin.otp || !admin.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP found, please request again",
      });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (admin.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;

    if (!mobile || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Mobile, OTP and new password are required",
      });
    }

    const admin = await Admin.findOne({ mobile });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!admin.otpExpiry || admin.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    admin.otp = "";
    admin.otpExpiry = null;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reset password failed",
      error: error.message,
    });
  }
};