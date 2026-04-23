import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bestURL from "../../utils/bestURL";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  // form state
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  });

  // loading state button disable karne ke liye
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // input change handle karne ka function
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // login submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${bestURL}/admin/login`, formData);

      // agar login success ho to token aur admin context/localStorage me save honge
      if (data.success) {
        login(data.token, data.admin);
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Admin login and open the dashboard</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrMobile"
            placeholder="Email or Mobile"
            value={formData.emailOrMobile}
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
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <div className="login-links">
          <p>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
