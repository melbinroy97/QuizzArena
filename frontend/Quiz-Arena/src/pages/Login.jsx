import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

 const submit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    await api.post("/auth/login", form);
    await login(form);
    navigate("/dashboard");
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message;

    // ✅ ONLY for unverified existing users
    if (status === 403 && message?.toLowerCase().includes("not verified")) {
      navigate("/verify-otp", { state: { email: form.email } });
      return;
    }

    // ❌ All other cases show error
    setError(message || "Login failed");
  }
};



  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="bg-white w-96 rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Login to QuizzArena
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="auth-btn">Login</button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Sign up
          </Link>
          
          <br />
          <Link to="/forgot-password" className="text-sm text-blue-600">
            Forgot Password?
          </Link>

        </p>
      </div>
    </div>
  );
}
