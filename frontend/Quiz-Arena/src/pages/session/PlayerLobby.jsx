import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../../socket";

export default function PlayerLobby() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join-session", sessionId);

    socket.on("quiz-started", () => {
      navigate(`/player/quiz/${sessionId}`);
    });

    return () => socket.off("quiz-started");
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Waiting for host to start...</h1>
    </div>
  );
}
