import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronDown,
  Search,
  Bell,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/tasks", icon: ListTodo, label: "Tasks" },
    ...(user?.role === "admin"
      ? [{ to: "/projects", icon: FolderKanban, label: "Projects" }]
      : []),
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* ====== SIDEBAR ====== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-[var(--header-height)] flex items-center px-5 border-b border-[var(--border-primary)]">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Ethara AI
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[0.6875rem] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-[0.8125rem] font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-[var(--brand-muted)] text-[var(--brand-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-[var(--border-primary)] p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-[var(--brand-muted)] flex items-center justify-center text-xs font-semibold text-[var(--brand-primary)]">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.8125rem] font-medium text-[var(--text-primary)] truncate">
                {user?.name}
              </p>
              <p className="text-[0.6875rem] text-[var(--text-tertiary)] truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-[0.8125rem] font-medium text-[var(--danger)] hover:bg-[var(--danger-muted)] transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ====== MAIN AREA ====== */}
      <div className="lg:pl-[var(--sidebar-width)]">
        {/* Header */}
        <header className="sticky top-0 z-20 h-[var(--header-height)] bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border-primary)] px-4 lg:px-6">
          <div className="h-full flex items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              {/* Breadcrumb-style page title */}
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--text-tertiary)]">Ethara AI</span>
                <span className="text-[var(--text-tertiary)]">/</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {navItems.find((i) => i.to === location.pathname)?.label ||
                    "Page"}
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <button className="relative h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
              </button>

              <div className="hidden sm:block h-5 w-px bg-[var(--border-primary)] mx-1" />

              <div className="hidden sm:flex items-center gap-2 pl-1">
                <div className="h-7 w-7 rounded-full bg-[var(--brand-muted)] flex items-center justify-center text-xs font-semibold text-[var(--brand-primary)]">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-[0.8125rem] font-medium text-[var(--text-primary)]">
                  {user?.name?.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
