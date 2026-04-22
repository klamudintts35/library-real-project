// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "../../components/Header/Header";
// import bestURL from "../../utils/bestURL";
// import { useAuth } from "../../context/AuthContext";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const [studentCount, setStudentCount] = useState(0);
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   // total students fetch karne ka logic
//   const fetchStudents = async () => {
//     try {
//       const { data } = await axios.get(`${bestURL}/students/list`, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       if (data.success) {
//         setStudentCount(data.count);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <>
//       <Header />

//       <div className="dashboard-page">
//         <div className="dashboard-top">
//           <h1>Admin Dashboard</h1>
//           <p>Yahan se admin students manage karega</p>
//         </div>

//         <div className="dashboard-stats">
//           <div className="dashboard-card">
//             <h3>Total Students</h3>
//             <h2>{studentCount}</h2>
//           </div>
//         </div>

//         <div className="dashboard-actions">
//           <button onClick={() => navigate("/students/view")}>View Students</button>
//           <button onClick={() => navigate("/students/add")}>Add Student</button>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import bestURL from "../../utils/bestURL";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  // alag alag stats ke liye states
  const [studentCount, setStudentCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [dueCount, setDueCount] = useState(0);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // students fetch karke total, active aur due count nikalna
  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${bestURL}/students/list`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        const students = data.students || [];

        // total students
        setStudentCount(students.length);

        // active students
        const activeStudents = students.filter(
          (student) => student.status === "active"
        );
        setActiveCount(activeStudents.length);

        // due/expired students
        const dueStudents = students.filter(
          (student) =>
            student.status === "expired" ||
            student.status === "due"
        );
        setDueCount(dueStudents.length);
      }
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // logout logic
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Header />

      <div className="dashboard-page">
        <div className="dashboard-top">
          <h1>Admin Dashboard</h1>
          <p>Yahan se admin students manage karega</p>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="dashboard-card total-card">
            <p className="card-label">Total Students</p>
            <h2>{studentCount}</h2>
          </div>

          <div className="dashboard-card active-card">
            <p className="card-label">Active Students</p>
            <h2>{activeCount}</h2>
          </div>

          <div className="dashboard-card due-card">
            <p className="card-label">Due Students</p>
            <h2>{dueCount}</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="dashboard-actions">
          <button
            className="view-btn"
            onClick={() => navigate("/students/view")}
          >
            View Students
          </button>

          <button
            className="add-btn"
            onClick={() => navigate("/students/add")}
          >
            Add Student
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;