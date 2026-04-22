import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bestURL from "../../utils/bestURL";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // input change logic
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // register submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${bestURL}/admin/register`, formData);

      if (data.success) {
        login(data.token, data.admin);
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Admin Register</h1>
        <p className="register-subtitle">Naya admin account banao</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Admin Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        <div className="register-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;