import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  LogOut,
  Menu,
  X,
  Settings,
  Bell,
  Sparkles
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/tasks", icon: ListTodo, label: "Tasks" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", position: "relative", zIndex: 0 }}>
      {/* GLOBAL AMBIENT BACKGROUND BLOBS */}
      <div 
        style={{
          position: "fixed", top: "-10%", left: "-5%", width: "50vw", height: "50vw",
          background: "radial-gradient(circle, var(--brand-subtle) 0%, transparent 60%)",
          opacity: 0.15, filter: "blur(80px)", pointerEvents: "none", zIndex: -1,
        }}
      />
      <div 
        style={{
          position: "fixed", bottom: "-10%", right: "-5%", width: "40vw", height: "40vw",
          background: "radial-gradient(circle, var(--info-muted) 0%, transparent 60%)",
          opacity: 0.2, filter: "blur(80px)", pointerEvents: "none", zIndex: -1,
        }}
      />

      {/* SIDEBAR (Glassmorphic) */}
      <aside
        style={{
          position: "fixed",
          inset: "16px auto 16px 16px",
          zIndex: 40,
          width: "calc(var(--sidebar-w) - 16px)",
          borderRadius: 24,
          backgroundColor: "color-mix(in srgb, var(--bg-secondary) 70%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
          boxShadow: "0 8px 32px -4px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-120%)",
        }}
        className="lg:!translate-x-0"
      >
        {/* Logo */}
        <div style={{ height: 72, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid color-mix(in srgb, var(--border) 30%, transparent)" }}>
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ height: 32, width: 32, borderRadius: 10, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--brand-muted)" }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Ethara AI
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "24px 16px", overflowY: "auto" }}>
          <p style={{ padding: "0 12px", marginBottom: 12, fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Workspace
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 9999,
                  fontSize: 13, fontWeight: 500, textDecoration: "none",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  backgroundColor: isActive ? "var(--text-primary)" : "transparent",
                  color: isActive ? "var(--bg-primary)" : "var(--text-secondary)",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                })}
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User */}
        <div style={{ padding: 16, borderTop: "1px solid color-mix(in srgb, var(--border) 30%, transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px", borderRadius: 9999, backgroundColor: "color-mix(in srgb, var(--bg-tertiary) 50%, transparent)" }}>
            <div style={{ height: 36, width: 36, borderRadius: "50%", backgroundColor: "var(--brand-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--brand)" }}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{ marginTop: 8, display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 16px", borderRadius: 9999, fontSize: 13, fontWeight: 600, color: "var(--clr-danger)", background: "color-mix(in srgb, var(--clr-danger-bg) 50%, transparent)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--clr-danger-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--clr-danger-bg) 50%, transparent)")}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden eth-fade-in"
          style={{ position: "fixed", inset: 0, zIndex: 30, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
        />
      )}

      {/* MAIN AREA */}
      <div className="lg:pl-[var(--sidebar-w)]" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header (Glassmorphic) */}
        <header
          style={{
            position: "sticky", top: 16, zIndex: 20, margin: "0 16px", height: 64,
            borderRadius: 9999, backgroundColor: "color-mix(in srgb, var(--bg-secondary) 70%, transparent)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)",
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
              style={{ height: 36, width: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", background: "var(--bg-tertiary)", color: "var(--text-primary)", cursor: "pointer" }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="hidden sm:flex" style={{ alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: "var(--text-tertiary)" }}>Ethara AI</span>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ color: "var(--text-primary)" }}>
                {navItems.find((i) => i.to === location.pathname)?.label || "Page"}
              </span>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ThemeToggle />
            <button style={{ position: "relative", height: 36, width: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", background: "var(--bg-tertiary)", color: "var(--text-primary)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              <Bell size={16} />
              <span style={{ position: "absolute", top: 8, right: 8, height: 8, width: 8, borderRadius: "50%", backgroundColor: "var(--clr-danger)", border: "2px solid var(--bg-tertiary)" }} />
            </button>
            <div className="hidden sm:flex" style={{ height: 36, display: "flex", alignItems: "center", padding: "0 6px 0 16px", borderLeft: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", marginLeft: 4, gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{user?.name?.split(" ")[0]}</span>
              <div style={{ height: 28, width: 28, borderRadius: "50%", backgroundColor: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "32px 16px" }} className="lg:p-8 eth-fade-in">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
