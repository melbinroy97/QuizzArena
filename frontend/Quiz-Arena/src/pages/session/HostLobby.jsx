import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../../socket";
import axios from "../../api/axios";

export default function HostLobby() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    socket.emit("join-session", sessionId);

    socket.on("player-joined", () => {
      fetchParticipants();
    });

    socket.on("quiz-started", () => {
      navigate(`/host/quiz/${sessionId}`);
    });

    fetchParticipants();

    return () => socket.off();
  }, []);

  const fetchParticipants = async () => {
    const res = await axios.get(`/sessions/${sessionId}/leaderboard`);
    setParticipants(res.data.leaderboard);
  };

  const startQuiz = async () => {
    try {
    await axios.post(`/sessions/${sessionId}/start`);
    navigate(`/host/quiz/${sessionId}`);
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Failed to start quiz");
  }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Host Lobby</h1>

      <h2 className="mt-4 font-semibold">Participants</h2>
      <ul>
        {participants.map((p) => (
          <li key={p.userId}>{p.username}</li>
        ))}
      </ul>

      <button
        onClick={startQuiz}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start Quiz
      </button>
    </div>
  );
}
