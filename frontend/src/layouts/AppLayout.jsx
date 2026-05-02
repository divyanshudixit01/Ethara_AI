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
    ...(user?.role === "admin"
      ? [{ to: "/projects", icon: FolderKanban, label: "Projects" }]
      : []),
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: 40,
          width: "var(--sidebar-w)",
          backgroundColor: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease-out",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        className="lg:!translate-x-0"
      >
        {/* Logo */}
        <div
          style={{
            height: "var(--header-h)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                height: 28,
                width: 28,
                borderRadius: 8,
                backgroundColor: "var(--brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>E</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              Ethara AI
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <p
            style={{
              padding: "0 12px",
              marginBottom: 8,
              fontSize: 11,
              fontWeight: 500,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Navigation
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background-color 0.15s, color 0.15s",
                  backgroundColor: isActive ? "var(--brand-muted)" : "transparent",
                  color: isActive ? "var(--brand)" : "var(--text-secondary)",
                })}
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User */}
        <div style={{ borderTop: "1px solid var(--border)", padding: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 8px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div
              style={{
                height: 32,
                width: 32,
                borderRadius: "50%",
                backgroundColor: "var(--brand-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--brand)",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              marginTop: 4,
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--clr-danger)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--clr-danger-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
          className="lg:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* MAIN AREA */}
      <div className="lg:pl-[240px]">
        {/* Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            height: "var(--header-h)",
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
              style={{
                height: 32,
                width: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="hidden sm:flex" style={{ alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--text-tertiary)" }}>Ethara AI</span>
              <span style={{ color: "var(--text-tertiary)" }}>/</span>
              <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                {navItems.find((i) => i.to === location.pathname)?.label || "Page"}
              </span>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <button
              style={{
                position: "relative",
                height: 32,
                width: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  height: 6,
                  width: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--brand)",
                }}
              />
            </button>

            <div className="hidden sm:flex" style={{ alignItems: "center", gap: 8, paddingLeft: 8, borderLeft: "1px solid var(--border)", marginLeft: 4 }}>
              <div
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: "50%",
                  backgroundColor: "var(--brand-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--brand)",
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                {user?.name?.split(" ")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: "16px" }} className="lg:p-6 eth-fade-in">
          <div style={{ maxWidth: 1024, margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
