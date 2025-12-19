import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import socket from "../../socket";
import Leaderboard from "./Leaderboard";



export default function HostQuiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/sessions/${sessionId}/question`);
      setQuestion(res.data.question);
    } catch (err) {
      if (err.response?.status === 400) {
        setQuestion(null); // quiz not live yet
      } else {
        console.error(err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      await api.post(`/sessions/${sessionId}/start`);
      fetchQuestion();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start quiz");
    }
  };

  const nextQuestion = async () => {
    try {
      const res = await api.post(`/sessions/${sessionId}/next`);

      if (res.data.status === "ended") {
        setEnded(true);
        setQuestion(null);

        setTimeout(() => {
          navigate(`/session/${sessionId}/leaderboard`);
        }, 1500);
      } else {
        fetchQuestion();
      }
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  useEffect(() => {
    socket.emit("join-session", sessionId);

    socket.on("quiz-started", fetchQuestion);
    socket.on("next-question", fetchQuestion);
    socket.on("quiz-ended", () => {
      setEnded(true);
      setQuestion(null);
      navigate(`/host/leaderboard/${sessionId}`);
    });

    fetchQuestion();

    return () => {
      socket.off("quiz-started", fetchQuestion);
      socket.off("next-question", fetchQuestion);
      socket.off("quiz-ended");
    };
  }, [sessionId]);

  if (ended) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Quiz Ended 🎉</h2>
        <p>Redirecting to leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Host Quiz Panel</h2>

      {!question ? (
        <button
          onClick={startQuiz}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Start Quiz
        </button>
      ) : (
        <>
          <h3 className="font-semibold mb-2">
            Question {question.index + 1}
          </h3>
          <p className="mb-4">{question.text}</p>

          <button
            onClick={nextQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next Question
          </button>
        </>
      )}
      <Leaderboard sessionId={sessionId} />
      {loading && <p className="mt-4">Loading...</p>}
    </div>
  );
}
