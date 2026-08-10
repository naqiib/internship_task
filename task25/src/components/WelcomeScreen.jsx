import { useState } from "react";

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onStart(trimmed);
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-stone-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-2xl border border-stone-200 shadow-sm p-8 text-center"
      >
        <div className="text-4xl mb-3">🏔️</div>
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Hindukush Task Manager</h1>
        <p className="text-stone-500 text-sm mb-6">Enter your name to get started</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          Enter Dashboard
        </button>
      </form>
    </div>
  );
}
