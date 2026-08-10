import { useState } from "react";
import TaskCard from "./TaskCard";

// Higher number = higher priority = sorted first
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

let nextId = 4;

export default function TaskManager({ userName }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Wireframe mobile app screens", priority: "medium", completed: false },
    { id: 2, title: "Set up Firebase auth", priority: "high", completed: false },
    { id: 3, title: "Push Day 24 task to GitHub", priority: "low", completed: true },
  ]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  function handleAddTask(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return; // guard clause: skip empty submissions

    setTasks((prev) => [...prev, { id: nextId++, title: trimmed, priority, completed: false }]);
    setTitle("");
    setPriority("medium");
  }

  function handleComplete(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // Derived data — never stored in state directly, always computed from `tasks`
  const pendingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="flex-1 bg-stone-100 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">{userName}'s Dashboard</h1>
        <p className="text-stone-500 mb-6">
          {pendingTasks.length} pending · {completedTasks.length} completed
        </p>

        {/* Add-task form */}
        <form
          onSubmit={handleAddTask}
          className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-8"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Add Task
          </button>
        </form>

        {/* Pending tasks — sorted high to low priority */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">
            Pending Tasks
          </h2>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-stone-400 italic">No pending tasks. Nicely done.</p>
          ) : (
            pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} onDelete={handleDelete} />
            ))
          )}
        </section>

        {/* Completed tasks — shown with their names, struck through */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">
            Completed Tasks
          </h2>
          {completedTasks.length === 0 ? (
            <p className="text-sm text-stone-400 italic">Nothing completed yet.</p>
          ) : (
            completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} onDelete={handleDelete} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
