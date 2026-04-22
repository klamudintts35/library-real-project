import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    otp: {
      type: String,
      default: "",
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;