import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-8">
        <button
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/quiz/create")}
        >
          Create Quiz
        </button>

        <button
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/quiz/list")}
        >
          My Quizzes
        </button>

        <button
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/session/join")}
        >
          Join Quiz
        </button>
      </div>

      <div className="bg-white text-black p-6 rounded shadow">
        <p className="text-gray-700">
          Choose an action above to continue.
        </p>
      </div>
    </div>
  );
}
