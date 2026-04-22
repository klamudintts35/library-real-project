import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bestURL from "../../utils/bestURL";
import "./ForgotPassword.css";
// import "./ForgotPassword.css"

const ForgotPassword = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // OTP send logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${bestURL}/admin/forgot-password`, {
        mobile,
      });

      if (data.success) {
        localStorage.setItem("resetMobile", mobile);
        navigate("/verify-otp");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h1>Forgot Password</h1>
        <p>Mobile number dalo, OTP generate hoga</p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;