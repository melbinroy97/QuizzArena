import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-xl w-96"
      >
        <h2 className="text-xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="email"
          className="auth-input"
          placeholder="Enter email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="auth-btn mt-4">Send OTP</button>
      </form>
    </div>
  );
}
