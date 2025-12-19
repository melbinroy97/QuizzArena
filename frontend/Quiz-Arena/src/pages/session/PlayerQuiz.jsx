import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import socket from "../../socket";
import Leaderboard from "./Leaderboard";
import { useNavigate } from "react-router-dom";


export default function PlayerQuiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [totalTime, setTotalTime] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(null);

  const timerRef = useRef(null);

  // ⏱️ Start timer
  const startTimer = (endsAt) => {
    clearInterval(timerRef.current);

    const endTime = new Date(endsAt).getTime();

    timerRef.current = setInterval(() => {
      const diff = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setTimeLeft(diff);

      if (diff === 0) {
        clearInterval(timerRef.current);
        setShowAnswer(true);
      }
    }, 1000);
  };

  // 🔹 Fetch question
  const fetchQuestion = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/sessions/${sessionId}/question`);
      const q = res.data.question;

      const seconds =
      Math.ceil(
        (new Date(q.endsAt).getTime() - Date.now()) / 1000
      );

      setTotalTime(seconds);
      setTimeLeft(seconds);



      setQuestion(q);
      setSelectedOption(null);
      setCorrectIndex(null);
      setShowAnswer(false);
      setWaiting(false);

      startTimer(q.endsAt);
    } catch (err) {
      if (err.response?.status === 400) {
        setQuestion(null);
        setWaiting(true);
      } else {
        console.error("Fetch question error:", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // 📨 Submit answer
  const submitAnswer = async (index) => {
    if (selectedOption !== null || timeLeft === 0) return;

    setSelectedOption(index);

    try {
      const res = await api.post(
        `/sessions/${sessionId}/answer`,
        { selectedOption: index }
      );

      // backend returns `correct` (boolean) and `score`
      setCorrectIndex(res.data.correct ? index :  null);
      setEarnedPoints(res.data.score);
      setShowAnswer(true);
    } catch (err) {
      console.error("Submit answer error:", err.response?.data);
    }
  };

  // 🔥 Socket lifecycle
  useEffect(() => {
    socket.emit("join-session", sessionId);

    fetchQuestion();

    socket.on("quiz-started", fetchQuestion);
    socket.on("next-question", fetchQuestion);
    socket.on("quiz-ended", () => {
      clearInterval(timerRef.current);
      setEnded(true);
      setQuestion(null);
        navigate(`/player/review/${sessionId}`);
    });

    return () => {
      clearInterval(timerRef.current);
      socket.off("quiz-started");
      socket.off("next-question");
      socket.off("quiz-ended");
    };
  }, [sessionId]);

  // ================= UI STATES =================

  if (loading) return <p className="p-6">Loading...</p>;

  if (ended) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Quiz Ended 🎉</h2>
        <p>Waiting for leaderboard...</p>
      </div>
    );
  }

  if (waiting || !question) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">
          Waiting for host to start...
        </h2>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">
          Question {question.index + 1}
        </h2>

        <div className="flex flex-col items-end">
  <span
    className={`text-sm font-semibold ${
      timeLeft <= 5 ? "text-red-600" : ""
    }`}
  >
    ⏱ {timeLeft}s
  </span>

  <div className="w-32 h-2 bg-gray-200 rounded mt-1 overflow-hidden">
    <div
      className={`h-full transition-all duration-1000 ${
        timeLeft <= 5 ? "bg-red-500" : "bg-green-500"
      }`}
      style={{
        width: `${(timeLeft / totalTime) * 100}%`,
      }}
    />
  </div>
</div>

      </div>

      <p className="mb-4">{question.text}</p>

      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          let bg = "bg-gray-100 hover:bg-gray-200";

          if (showAnswer) {
            if (idx === correctIndex) bg = "bg-green-500 text-white";
            else if (idx === selectedOption)
              bg = "bg-red-500 text-white";
          } else if (idx === selectedOption) {
            bg = "bg-blue-600 text-white";
          }

          return (
            <button
              key={idx}
              onClick={() => submitAnswer(idx)}
              disabled={showAnswer || timeLeft === 0}
              className={`w-full px-4 py-2 rounded border transition ${bg}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <p className="mt-4 text-center font-semibold">
          {selectedOption === correctIndex
            ? "✅ Correct!"
            : "❌ Wrong answer"}
        </p>
      )}

       {showAnswer && (
        <p className="mt-2 text-center text-green-600 font-bold">
          +{earnedPoints} points ⚡
        </p>
      )}

      {showAnswer && (
        <Leaderboard sessionId={sessionId} />
      )}
    </div>
  );
}
