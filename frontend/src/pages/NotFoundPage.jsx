import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-6 text-center overflow-hidden relative">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div className="z-10 animate-fade-in">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 text-red-500 dark:bg-red-900/20 mb-8">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-8xl font-black tracking-tighter text-[var(--text-primary)] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Lost in Cyberspace?</h2>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-10 font-medium">
        The page you are looking for doesn't exist or has been moved to a new coordinate.
      </p>
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-8 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
      >
        <Home size={20} />
        Return to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
