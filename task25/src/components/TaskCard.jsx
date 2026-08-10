const PRIORITY_STYLES = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export default function TaskCard({ task, onComplete, onDelete }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 bg-white rounded-lg border border-stone-200 shadow-sm px-4 py-3 mb-3 ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {!task.completed && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </span>
        )}
        {task.completed && <span className="text-emerald-500 shrink-0">✓</span>}
        <p className={`text-stone-800 truncate ${task.completed ? "line-through text-stone-400" : "font-medium"}`}>
          {task.title}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!task.completed && (
          <button
            onClick={() => onComplete(task.id)}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="text-stone-300 hover:text-rose-500 text-sm"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
