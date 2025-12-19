import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function FinalLeaderboard() {
  const { sessionId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/leaderboard`);
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error("Final leaderboard error", err.response?.data);
      }
    };

    fetchLeaderboard();
  }, [sessionId]);

  if (!leaderboard.length) {
    return <p className="p-6">Loading results...</p>;
  }

  const [first, second, third] = leaderboard;

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">🏁 Quiz Results</h2>

      {/* 🏆 PODIUM */}
      <div className="flex justify-center gap-6 mb-8">
        {second && (
          <PodiumCard place="🥈 2nd" user={second} />
        )}
        {first && (
          <PodiumCard place="🥇 1st" user={first} highlight />
        )}
        {third && (
          <PodiumCard place="🥉 3rd" user={third} />
        )}
      </div>

      {/* 📊 FULL LEADERBOARD */}
      <h3 className="text-xl font-bold mb-3">Full Leaderboard</h3>
      <ul className="space-y-2">
        {leaderboard.map((p, i) => (
          <li
            key={p.userId}
            className="flex justify-between bg-gray-100 px-4 py-2 rounded"
          >
            <span>
              {i + 1}. {p.username || p.fullName}
            </span>
            <span className="font-bold">{p.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PodiumCard({ place, user, highlight }) {
  return (
    <div
      className={`px-4 py-6 rounded w-32 ${
        highlight ? "bg-yellow-300 scale-110" : "bg-gray-200"
      }`}
    >
      <p className="font-bold">{place}</p>
      <p className="mt-2">{user.username || user.fullName}</p>
      <p className="font-bold mt-1">{user.score}</p>
    </div>
  );
}
