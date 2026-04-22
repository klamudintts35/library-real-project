// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Header from "../../components/Header/Header";
// import bestURL from "../../utils/bestURL";
// import "./EditStudent.css";

// const EditStudent = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

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

//   // single student fetch logic
//   const fetchStudent = async () => {
//     try {
//       const { data } = await axios.get(`${bestURL}/students/${id}`, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       if (data.success) {
//         setFormDataState({
//           name: data.student.name || "",
//           phone: data.student.phone || "",
//           course: data.student.course || "",
//           address: data.student.address || "",
//           admissionDate: data.student.admissionDate?.slice(0, 10) || "",
//           expiryDate: data.student.expiryDate?.slice(0, 10) || "",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchStudent();
//   }, []);

//   const handleChange = (e) => {
//     setFormDataState((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // update logic
//   const handleUpdate = async (e) => {
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

//       if (photo) {
//         formData.append("photo", photo);
//       }

//       const { data } = await axios.put(`${bestURL}/students/update/${id}`, formData, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       if (data.success) {
//         alert("Student updated successfully");
//         navigate("/students/view");
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <div className="edit-student-page">
//         <form className="edit-student-form" onSubmit={handleUpdate}>
//           <h2>Edit Student</h2>

//           <input
//             type="text"
//             name="name"
//             value={formDataState.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="text"
//             name="phone"
//             value={formDataState.phone}
//             onChange={handleChange}
//           />

//           <input
//             type="text"
//             name="course"
//             value={formDataState.course}
//             onChange={handleChange}
//           />

//           <input
//             type="text"
//             name="address"
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

//           <label>Change Photo (optional)</label>
//           <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

//           <button type="submit" disabled={loading}>
//             {loading ? "Please wait..." : "Update Student"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default EditStudent;



import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import bestURL from "../../utils/bestURL";
import "./EditStudent.css";

const EditStudent = () => {
  // URL se student id lena
  const { id } = useParams();

  // page navigate karne ke liye
  const navigate = useNavigate();

  // form state
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

  // new photo ke liye state
  const [photo, setPhoto] = useState(null);

  // loading button state
  const [loading, setLoading] = useState(false);

  // single student data fetch karna
  const fetchStudent = async () => {
    try {
      const { data } = await axios.get(`${bestURL}/students/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setFormDataState({
          name: data.student.name || "",
          phone: data.student.phone || "",
          course: data.student.course || "",
          address: data.student.address || "",
          admissionDate: data.student.admissionDate?.slice(0, 10) || "",
          expiryDate: data.student.expiryDate?.slice(0, 10) || "",
          totalFee: data.student.totalFee ?? "",
          paidFee: data.student.paidFee ?? "",
          timing: data.student.timing || "",
        });
      }
    } catch (error) {
      console.log("Fetch student error:", error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // input change handle
  const handleChange = (e) => {
    setFormDataState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // photo change handle
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0] || null);
  };

  // due fee preview sirf UI me dikhane ke liye
  const dueFeePreview = useMemo(() => {
    const total = Number(formDataState.totalFee) || 0;
    const paid = Number(formDataState.paidFee) || 0;
    const due = total - paid;
    return due >= 0 ? due : 0;
  }, [formDataState.totalFee, formDataState.paidFee]);

  // update student logic
  const handleUpdate = async (e) => {
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

      const { data } = await axios.put(
        `${bestURL}/students/update/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        alert("Student updated successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="edit-student-page">
        <div className="edit-student-wrapper">
          <form className="edit-student-form" onSubmit={handleUpdate}>
            <h2>Edit Student</h2>
            <p className="form-subtitle">
              Student details ko update karo
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
                <label>Change Photo (optional)</label>
                <input type="file" onChange={handlePhotoChange} />
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Update Student"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditStudent;