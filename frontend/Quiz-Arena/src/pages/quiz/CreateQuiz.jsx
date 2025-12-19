import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateSession = async () => {
    try {
      setLoading(true);

      // MUST be a quiz created by this logged-in user
      const quizId = "6943db9d79a18cee56bc4996";

      const res = await axios.post("/sessions", { quizId });

      console.log("CREATE SESSION RESPONSE:", res.data);

      // ✅ FIXED: read directly from res.data
      setJoinCode(res.data.joinCode);
      setSessionId(res.data.sessionId);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Session creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Quiz</h2>

      {!joinCode ? (
        <button
          onClick={handleCreateSession}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
      ) : (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <p className="font-semibold">Share this Join Code:</p>
          <p className="text-3xl font-bold text-blue-600 tracking-widest">
            {joinCode}
          </p>

          <button
            onClick={() => navigate(`/host/lobby/${sessionId}`)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Go to Host Lobby
          </button>
        </div>
      )}
    </div>
  );
}
