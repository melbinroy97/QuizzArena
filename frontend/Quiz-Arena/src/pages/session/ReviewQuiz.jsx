import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function ReviewQuiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await api.get(
          `/sessions/${sessionId}/review`
        );
        setReview(res.data.review);
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error(err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [sessionId]);

  if (loading) {
    return <p className="p-6 text-center">Loading review...</p>;
  }

  const winner = leaderboard[0];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 🎉 Confetti */}
      {winner && <Confetti recycle={false} numberOfPieces={300} />}

      {/* 🏆 Winner */}
      {winner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-yellow-300 p-6 rounded-xl text-center shadow-lg mb-8"
        >
          🏆 Winner: {winner.username || winner.fullName}
          <div className="text-xl font-bold">
            {winner.score} points
          </div>
        </motion.div>
      )}

      {/* 📘 Answer Review */}
      <h2 className="text-2xl font-bold mb-6">
        Answer Review
      </h2>

      {review.map((q, qi) => (
        <div
          key={qi}
          className="mb-6 p-4 border rounded"
        >
          <h3 className="font-semibold mb-2">
            Q{qi + 1}. {q.text}
          </h3>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let bg = "bg-gray-100";

              if (idx === q.correctIndex)
                bg = "bg-green-500 text-white";
              if (
                idx === q.yourAnswer &&
                q.yourAnswer !== q.correctIndex
              )
                bg = "bg-red-500 text-white";

              return (
                <div
                  key={idx}
                  className={`p-2 rounded ${bg}`}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 🚪 Exit */}
      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
