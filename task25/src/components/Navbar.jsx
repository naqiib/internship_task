export default function Navbar({ userName, onLogout }) {
  return (
    <header className="bg-stone-950 text-stone-100 relative overflow-hidden">
      {/* Signature: a faint mountain silhouette, echoing "Hindukush" */}
      <svg
        className="absolute bottom-0 left-0 w-full h-12 opacity-10"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 L40 15 L70 40 L110 5 L150 45 L190 20 L230 50 L270 10 L310 42 L350 18 L400 60 Z"
          fill="currentColor"
        />
      </svg>

      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏔️</span>
          <span className="font-bold text-lg tracking-tight">Hindukush Task Manager</span>
        </div>

        {userName && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-300">
              Welcome, <span className="font-semibold text-white">{userName}</span>
            </span>
            <button
              onClick={onLogout}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              Switch User
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
