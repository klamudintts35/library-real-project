// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "../../components/Header/Header";
// import bestURL from "../../utils/bestURL";
// import "./ViewStudents.css";

// const ViewStudents = () => {
//   const [students, setStudents] = useState([]);
//   const navigate = useNavigate();

//   // student list fetch logic
//   const fetchStudents = async () => {
//     try {
//       const { data } = await axios.get(`${bestURL}/students/list`, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       if (data.success) {
//         setStudents(data.students);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // delete logic
//   const handleDelete = async (id) => {
//     try {
//       const { data } = await axios.delete(`${bestURL}/students/delete/${id}`, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       if (data.success) {
//         fetchStudents();
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Delete failed");
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   return (
//     <>
//       <Header />

//       <div className="view-students-page">
//         <div className="view-students-top">
//           <h2>All Students</h2>
//         </div>

//         <div className="table-wrapper">
//           <table>
//             <thead>
//               <tr>
//                 <th>Photo</th>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Course</th>
//                 <th>Admission</th>
//                 <th>Expiry</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {students.map((student) => (
//                 <tr key={student._id}>
//                   <td>
//                     {student.photo ? (
//                       <img
//                         src={student.photo}
//                         alt="student"
//                         className="student-photo"
//                       />
//                     ) : (
//                       "No Photo"
//                     )}
//                   </td>
//                   <td>{student.name}</td>
//                   <td>{student.phone}</td>
//                   <td>{student.course}</td>
//                   <td>{student.admissionDate?.slice(0, 10)}</td>
//                   <td>{student.expiryDate?.slice(0, 10)}</td>
//                   <td>{student.status}</td>
//                   <td className="table-actions">
//                     <button onClick={() => navigate(`/students/edit/${student._id}`)}>
//                       Edit
//                     </button>
//                     <button onClick={() => handleDelete(student._id)}>
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ViewStudents;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import bestURL from "../../utils/bestURL";
import "./ViewStudents.css";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // student list fetch logic
  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${bestURL}/students/list`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete logic
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this student?");

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${bestURL}/students/delete/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        fetchStudents();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // expiry status text nikalne ka function
  const getExpiryInfo = (expiryDate) => {
    if (!expiryDate) {
      return {
        text: "No Date",
        className: "status-neutral",
      };
    }

    const today = new Date();
    const expiry = new Date(expiryDate);

    // time ko same date basis par compare karne ke liye
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Expired",
        className: "status-expired",
      };
    }

    if (diffDays === 0) {
      return {
        text: "Expires Today",
        className: "status-expired",
      };
    }

    if (diffDays >= 1 && diffDays <= 3) {
      return {
        text: `${diffDays} day left`,
        className: "status-warning",
      };
    }

    return {
      text: "Active",
      className: "status-active",
    };
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <Header />

      <div className="view-students-page">
        <div className="view-students-top">
          <h2>All Students</h2>
          <p>Yahan admin apne saare students dekh sakta hai</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Timing</th>
                <th>Total Fee</th>
                <th>Paid Fee</th>
                <th>Due Fee</th>
                <th>Admission</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((student) => {
                  const expiryInfo = getExpiryInfo(student.expiryDate);

                  return (
                    <tr key={student._id}>
                      <td>
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt="student"
                            className="student-photo"
                          />
                        ) : (
                          <span className="no-photo">No Photo</span>
                        )}
                      </td>

                      <td>{student.name}</td>
                      <td>{student.phone || "-"}</td>
                      <td>{student.course || "-"}</td>
                      <td>{student.timing || "-"}</td>
                      <td>{student.totalFee ?? 0}</td>
                      <td>{student.paidFee ?? 0}</td>
                      <td>{student.dueFee ?? 0}</td>
                      <td>{student.admissionDate?.slice(0, 10)}</td>
                      <td>{student.expiryDate?.slice(0, 10)}</td>

                      <td>
                        <span className={`status-badge ${expiryInfo.className}`}>
                          {expiryInfo.text}
                        </span>
                      </td>

                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => navigate(`/students/edit/${student._id}`)}
                        >
                          Edit
                        </button>
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="13" className="empty-row">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewStudents;