import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="bg-white w-96 rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Username"
            className="auth-input"
            required
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            placeholder="Full Name"
            className="auth-input"
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            required
            minLength={6}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="auth-btn">Register</button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
