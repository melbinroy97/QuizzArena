import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import socket from "../../socket";

export default function Leaderboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/sessions/${sessionId}/leaderboard`);

      setLeaderboard(res.data.leaderboard || []);
      setStatus(res.data.status);
    } catch (err) {
      console.error("Leaderboard fetch error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // live updates: refetch when server emits leaderboard-update
    socket.on("leaderboard-update", fetchLeaderboard);

    return () => {
      socket.off("leaderboard-update", fetchLeaderboard);
    };

  }, [sessionId]);

  // ================= UI STATES =================

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-semibold">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">
        🏆 Final Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p className="text-center text-gray-600">
          No players found
        </p>
      ) : (
        <ul className="space-y-3">
          {leaderboard.map((player, idx) => (
            <li
              key={player.userId}
              className={`flex justify-between items-center p-4 rounded shadow
                ${
                  idx === 0
                    ? "bg-yellow-100 border-2 border-yellow-400"
                    : "bg-gray-100"
                }
              `}
            >
              <span className="font-semibold">
                {idx === 0 && "🥇 "}
                {idx === 1 && "🥈 "}
                {idx === 2 && "🥉 "}
                {idx + 1}. {player.username || player.fullName}
              </span>

              <span className="font-bold text-lg">
                {player.score}
              </span>
            </li>
          ))}
        </ul>
      )}

      {status === "ended" && (
        <p className="mt-6 text-center text-green-600 font-semibold">
          Quiz Completed 🎉
        </p>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
