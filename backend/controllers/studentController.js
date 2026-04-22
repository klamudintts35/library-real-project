import Student from "../models/Student.js";
import cloudinary from "../config/cloudinary.js";

// export const addStudent = async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       course,
//       address,
//       admissionDate,
//       expiryDate,
//     } = req.body;

//     if (!name || !admissionDate || !expiryDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, admission date and expiry date are required",
//       });
//     }
//     const photo = req.file ? req.file.path : "";
//     const cloudinary_id = req.file ? req.file.filename : "";
//     const status = new Date(expiryDate) < new Date() ? "expired" : "active";

//     const student = await Student.create({
//       adminId: req.adminId,
//       name,
//       phone,
//       course,
//       address,
//       admissionDate,
//       expiryDate,
//       photo,
//       cloudinary_id,
//       status,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Student added successfully",
//       student,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to add student",
//       error: error.message,
//     });
//   }
// };

// import Student from "../models/Student.js";
// import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "library_students" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};



export const addStudent = async (req, res) => {
  try {
    const {
      name,
      phone,
      course,
      address,
      admissionDate,
      expiryDate,
      totalFee,
      paidFee,
      timing,
    } = req.body;

    if (!name || !admissionDate || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Name, admission date and expiry date are required",
      });
    }

    let photo = "";
    let cloudinary_id = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photo = result.secure_url;
      cloudinary_id = result.public_id;
    }

    const finalTotalFee = Number(totalFee) || 0;
    const finalPaidFee = Number(paidFee) || 0;
    const finalDueFee = finalTotalFee - finalPaidFee;

    let status = "active";

    if (new Date(expiryDate) < new Date()) {
      status = "expired";
    } else if (finalDueFee > 0) {
      status = "due";
    }

    const student = await Student.create({
      adminId: req.adminId,
      name,
      phone,
      course,
      address,
      admissionDate,
      expiryDate,
      photo,
      cloudinary_id,
      totalFee: finalTotalFee,
      paidFee: finalPaidFee,
      dueFee: finalDueFee,
      timing,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    console.log("ADD STUDENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ adminId: req.adminId }).sort({
      createdAt: -1,
    });

    const updatedStudents = students.map((student) => {
      const currentStatus =
        new Date(student.expiryDate) < new Date() ? "expired" : student.status;

      return {
        ...student._doc,
        status: currentStatus,
      };
    });

    res.status(200).json({
      success: true,
      count: updatedStudents.length,
      students: updatedStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

export const getSingleStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      adminId: req.adminId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      adminId: req.adminId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (req.file) {
      if (student.cloudinary_id) {
        await cloudinary.uploader.destroy(student.cloudinary_id);
      }

      const result = await uploadToCloudinary(req.file.buffer);
      student.photo = result.secure_url;
      student.cloudinary_id = result.public_id;
    }

    student.name = req.body.name || student.name;
    student.phone = req.body.phone || student.phone;
    student.course = req.body.course || student.course;
    student.address = req.body.address || student.address;
    student.admissionDate = req.body.admissionDate || student.admissionDate;
    student.expiryDate = req.body.expiryDate || student.expiryDate;
    student.timing = req.body.timing || student.timing;

    student.totalFee =
      req.body.totalFee !== undefined
        ? Number(req.body.totalFee)
        : student.totalFee;

    student.paidFee =
      req.body.paidFee !== undefined
        ? Number(req.body.paidFee)
        : student.paidFee;

    student.dueFee = student.totalFee - student.paidFee;

    if (new Date(student.expiryDate) < new Date()) {
      student.status = "expired";
    } else if (student.dueFee > 0) {
      student.status = "due";
    } else {
      student.status = "active";
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.log("UPDATE STUDENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      adminId: req.adminId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.cloudinary_id) {
      await cloudinary.uploader.destroy(student.cloudinary_id);
    }

    await Student.findByIdAndDelete(student._id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};