import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 🚫 Direct access protection
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="bg-white p-8 rounded-xl text-center w-96">
          <p className="text-red-600 font-medium mb-4">
            Invalid access to OTP verification
          </p>
          <Link to="/register" className="text-blue-600 font-semibold">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/verify-otp", { email, otp });
      setSuccess("Email verified successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      await api.post("/auth/resend-otp", { email });
      setSuccess("OTP resent successfully. Please check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl w-96 shadow-xl"
      >
        <h2 className="text-xl font-bold text-center mb-2">
          Verify Email
        </h2>

        <p className="text-sm text-center text-gray-600 mb-4">
          OTP sent to <span className="font-medium">{email}</span>
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center mb-3">{success}</p>
        )}

        <input
          className="auth-input block mx-auto w-56 text-center tracking-widest"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        <button
          className="auth-btn mt-4 w-full"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          onClick={resendOtp}
          disabled={resending}
          className="mt-3 text-sm text-blue-600 w-full hover:underline"
        >
          {resending ? "Resending OTP..." : "Resend OTP"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already verified?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
