import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    course: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    admissionDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    cloudinary_id: {
      type: String,
      default: "",
    },
    totalFee: {
      type: Number,
      default: 0,
    },

    paidFee: {
      type: Number,
      default: 0,
    },

    dueFee: {
      type: Number,
      default: 0,
    },

    timing: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "expired", "inactive", "due"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;