import { LayoutDashboard, FolderKanban, ListTodo, LogOut } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="text-lg font-semibold text-slate-900">
            Team Task Manager
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
              {user?.role}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm text-slate-500">Welcome, {user?.name}</p>
          <nav className="space-y-2">
            <NavLink to="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100">
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/projects" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100">
                <FolderKanban size={16} /> Projects
              </NavLink>
            )}
            <NavLink to="/tasks" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100">
              <ListTodo size={16} /> Tasks
            </NavLink>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
