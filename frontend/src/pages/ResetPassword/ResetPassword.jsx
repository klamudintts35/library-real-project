import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bestURL from "../../utils/bestURL";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const mobile = localStorage.getItem("resetMobile");
  const otp = localStorage.getItem("resetOtp");

  // password reset logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${bestURL}/admin/reset-password`, {
        mobile,
        otp,
        newPassword,
      });

      if (data.success) {
        localStorage.removeItem("resetMobile");
        localStorage.removeItem("resetOtp");
        alert("Password reset successful");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1>Reset Password</h1>
        <p>Naya password set karo</p>

        <form className="reset-form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;