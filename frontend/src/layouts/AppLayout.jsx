import { useState } from "react";
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, Menu, X, User } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
          isActive
            ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-indigo-500/30"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
        }`
      }
    >
      <Icon size={18} />
      {children}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 h-[var(--header-height)] border-b border-[var(--border-color)] px-4 lg:px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[var(--bg-primary)] lg:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white">
                E
              </div>
              <span>Ethara AI</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden h-8 w-[1px] bg-[var(--border-color)] md:block"></div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white">
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] transform border-r border-[var(--border-color)] bg-[var(--bg-secondary)] transition-transform duration-300 lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-4">
            <div className="mb-8 mt-4 px-2 lg:hidden">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Menu</p>
            </div>
            
            <nav className="flex-1 space-y-2">
              <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
              {user?.role === "admin" && (
                <NavItem to="/projects" icon={FolderKanban}>Projects</NavItem>
              )}
              <NavItem to="/tasks" icon={ListTodo}>Tasks</NavItem>
            </nav>

            <div className="mt-auto border-t border-[var(--border-color)] pt-4">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="min-h-[calc(100vh-var(--header-height))] flex-1 p-4 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
