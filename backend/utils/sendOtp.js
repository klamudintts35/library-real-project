const sendOtp = async (mobile, otp) => {
  console.log(`OTP for ${mobile}: ${otp}`);

  return {
    success: true,
    message: "OTP sent successfully",
  };
};

export default sendOtp;