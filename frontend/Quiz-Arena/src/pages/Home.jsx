export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/bg.svg')" }}
    >
      <h1 className="text-5xl font-bold mb-6">
        Welcome to Quizz Arena
      </h1>

      <p className="max-w-2xl text-center text-lg mb-10">
        Bridge classroom realities and curriculum expectations with an AI-supported,
        teacher-first quiz platform.
      </p>

      <div className="flex gap-6">
        <a
          href="/register"
          className="bg-blue-700 px-8 py-4 rounded-lg"
        >
          Sign Up
        </a>

        <a
          href="/login"
          className="bg-white text-blue-700 px-8 py-4 rounded-lg"
        >
          Login
        </a>
      </div>
    </div>
  );
}
