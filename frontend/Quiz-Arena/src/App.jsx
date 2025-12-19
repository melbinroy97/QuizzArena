import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import SocketTest from "./pages/SocketTest";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HostLobby from "./pages/session/HostLobby";
import PlayerLobby from "./pages/session/PlayerLobby";
import HostQuiz from "./pages/session/HostQuiz";
import PlayerQuiz from "./pages/session/PlayerQuiz";
import CreateQuiz from "./pages/quiz/CreateQuiz";
import QuizList from "./pages/quiz/QuizList";
import JoinQuiz from "./pages/session/JoinQuiz";
import Leaderboard from "./pages/session/Leaderboard";
import FinalLeaderboard from "./pages/session/FinalLeaderboard";
import ReviewQuiz from "./pages/session/ReviewQuiz";

function App() {
  return (
    <>
      <Navbar />

      {/* offset for fixed navbar */}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/socket-test" element={<SocketTest />} />
          <Route path="/host/lobby/:sessionId" element={<HostLobby />} />
          <Route path="/host/quiz/:sessionId" element={<HostQuiz />} />
          <Route path="/player/lobby/:sessionId" element={<PlayerLobby />} />
          <Route path="/player/quiz/:sessionId" element={<PlayerQuiz />} />
          <Route path="/quiz/create" element={<CreateQuiz />} />
          <Route path="/quiz/list" element={<QuizList />} />
          
          <Route
          path="/session/join"
          element={
            <ProtectedRoute>
              <JoinQuiz />
            </ProtectedRoute>
          }
        />

          
          <Route
        path="/session/:sessionId/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

          <Route
          path="/player/leaderboard/:sessionId"
          element={<FinalLeaderboard />}
        />

        <Route
          path="/host/leaderboard/:sessionId"
          element={<FinalLeaderboard />}
        />

        
        <Route
        path="/player/leaderboard/:sessionId"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

        <Route
          path="/player/review/:sessionId"
          element={<ReviewQuiz />}
        />


      <Route
        path="/host/leaderboard/:sessionId"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
