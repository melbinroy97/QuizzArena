import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!email) return <p>Invalid access</p>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <form className="bg-white p-8 rounded-xl shadow-xl w-96" onSubmit={submit}>
        <h2 className="text-xl font-bold text-center mb-4">
          Reset Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          className="auth-input"
          placeholder="OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          className="auth-input mt-3"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-btn mt-4">Reset Password</button>
      </form>
    </div>
  );
}
