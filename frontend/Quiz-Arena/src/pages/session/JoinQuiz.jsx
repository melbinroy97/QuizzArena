import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function JoinQuiz() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleJoin = async () => {
    setError(null);

    try {
      const res = await axios.post("/sessions/join", { joinCode });

      navigate(`/player/lobby/${res.data.sessionId}`);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to join quiz";

      setError(message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Join Quiz</h2>

      <input
        type="text"
        placeholder="Enter Join Code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
        className="border px-3 py-2 w-full mb-3"
      />

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Join
      </button>
    </div>
  );
}
