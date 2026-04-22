import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bestURL from "../../utils/bestURL";
import "./VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const mobile = localStorage.getItem("resetMobile");

  // OTP verify logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${bestURL}/admin/verify-otp`, {
        mobile,
        otp,
      });

      if (data.success) {
        localStorage.setItem("resetOtp", otp);
        navigate("/reset-password");
      }
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <h1>Verify OTP</h1>
        <p>Console wala OTP yahan dalo</p>

        <form className="otp-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;