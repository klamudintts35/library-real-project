// import { useState } from "react";
// import axios from "axios";
// import Header from "../../components/Header/Header";
// import bestURL from "../../utils/bestURL";
// import "./AddStudent.css";

// const AddStudent = () => {
//   const [formDataState, setFormDataState] = useState({
//     name: "",
//     phone: "",
//     course: "",
//     address: "",
//     admissionDate: "",
//     expiryDate: "",
//   });

//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // input field change handle
//   const handleChange = (e) => {
//     setFormDataState((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // form submit logic
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       formData.append("name", formDataState.name);
//       formData.append("phone", formDataState.phone);
//       formData.append("course", formDataState.course);
//       formData.append("address", formDataState.address);
//       formData.append("admissionDate", formDataState.admissionDate);
//       formData.append("expiryDate", formDataState.expiryDate);

//       // photo optional hai
//       if (photo) {
//         formData.append("photo", photo);
//       }

//       const { data } = await axios.post(`${bestURL}/students/add`, formData, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       if (data.success) {
//         alert("Student added successfully");

//         setFormDataState({
//           name: "",
//           phone: "",
//           course: "",
//           address: "",
//           admissionDate: "",
//           expiryDate: "",
//         });
//         setPhoto(null);
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to add student");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <div className="add-student-page">
//         <form className="add-student-form" onSubmit={handleSubmit}>
//           <h2>Add Student</h2>

//           <input
//             type="text"
//             name="name"
//             placeholder="Student Name"
//             value={formDataState.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone Number"
//             value={formDataState.phone}
//             onChange={handleChange}
//           />

//           <input
//             type="text"
//             name="course"
//             placeholder="Course"
//             value={formDataState.course}
//             onChange={handleChange}
//           />

//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={formDataState.address}
//             onChange={handleChange}
//           />

//           <label>Admission Date</label>
//           <input
//             type="date"
//             name="admissionDate"
//             value={formDataState.admissionDate}
//             onChange={handleChange}
//             required
//           />

//           <label>Expiry Date</label>
//           <input
//             type="date"
//             name="expiryDate"
//             value={formDataState.expiryDate}
//             onChange={handleChange}
//             required
//           />

//           <label>Photo (optional)</label>
//           <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

//           <button type="submit" disabled={loading}>
//             {loading ? "Please wait..." : "Add Student"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddStudent;



import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import bestURL from "../../utils/bestURL";
import "./AddStudent.css";




const AddStudent = () => {
  const [formDataState, setFormDataState] = useState({
    name: "",
    phone: "",
    course: "",
    address: "",
    admissionDate: "",
    expiryDate: "",
    totalFee: "",
    paidFee: "",
    timing: "",
  });
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // input field change handle
  const handleChange = (e) => {
    setFormDataState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // photo file handle
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0] || null);
  };

  // due fee sirf UI me dikhane ke liye
  const dueFeePreview = useMemo(() => {
    const total = Number(formDataState.totalFee) || 0;
    const paid = Number(formDataState.paidFee) || 0;
    const due = total - paid;
    return due >= 0 ? due : 0;
  }, [formDataState.totalFee, formDataState.paidFee]);

  // form reset function
  const resetForm = () => {
    setFormDataState({
      name: "",
      phone: "",
      course: "",
      address: "",
      admissionDate: "",
      expiryDate: "",
      totalFee: "",
      paidFee: "",
      timing: "",
    });
    setPhoto(null);
  };

  // form submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", formDataState.name);
      formData.append("phone", formDataState.phone);
      formData.append("course", formDataState.course);
      formData.append("address", formDataState.address);
      formData.append("admissionDate", formDataState.admissionDate);
      formData.append("expiryDate", formDataState.expiryDate);
      formData.append("totalFee", formDataState.totalFee);
      formData.append("paidFee", formDataState.paidFee);
      formData.append("timing", formDataState.timing);

      // photo optional hai
      if (photo) {
        formData.append("photo", photo);
      }

      const { data } = await axios.post(`${bestURL}/students/add`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        alert("Student added successfully");
        resetForm();
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="add-student-page">
        <div className="add-student-wrapper">
          <form className="add-student-form" onSubmit={handleSubmit}>
            <h2>Add Student</h2>
            <p className="form-subtitle">
              Student details, fee details aur timing enter karo
            </p>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Student Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter student name"
                  value={formDataState.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formDataState.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  placeholder="Enter course"
                  value={formDataState.course}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formDataState.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formDataState.admissionDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formDataState.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Fee</label>
                <input
                  type="number"
                  name="totalFee"
                  placeholder="Enter total fee"
                  value={formDataState.totalFee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Paid Fee</label>
                <input
                  type="number"
                  name="paidFee"
                  placeholder="Enter paid fee"
                  value={formDataState.paidFee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Due Fee</label>
                <input
                  type="number"
                  value={dueFeePreview}
                  readOnly
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>Timing</label>
                <input
                  type="text"
                  name="timing"
                  placeholder='Example: "4 to 6"'
                  value={formDataState.timing}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Photo (optional)</label>
                <input type="file" onChange={handlePhotoChange} />
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Add Student"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStudent;