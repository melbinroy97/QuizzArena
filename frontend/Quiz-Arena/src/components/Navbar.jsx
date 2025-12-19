import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        <Link to="/" className="flex items-center">
          <img src="logo1.png" alt="Logo" className="h-12" />
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="border border-blue-500 text-blue-600 px-4 py-2 rounded"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-blue-600">
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
