import { useState } from "react";
import { User, Mail, Shield, Moon, Sun, Bell, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const sections = [
    {
      title: "Profile",
      description: "Your personal information",
      items: [
        { icon: User, label: "Name", value: user?.name || "—" },
        { icon: Mail, label: "Email", value: user?.email || "—" },
        { icon: Shield, label: "Role", value: user?.role === "admin" ? "Administrator" : "Team Member", badge: true },
      ],
    },
  ];

  const glassStyle = {
    backgroundColor: "color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
    boxShadow: "0 8px 32px -4px rgba(0,0,0,0.03)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: 32,
    overflow: "hidden"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 720, margin: "0 auto" }}>
      <div className="eth-fade-in-up" style={{ paddingLeft: 8 }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={24} style={{ color: "var(--brand)" }} />
          Workspace Settings
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 6 }}>Manage your account and app preferences.</p>
      </div>

      {/* Profile */}
      <div className="eth-fade-in-up" style={{ ...glassStyle, animationDelay: "0.1s" }}>
        <div style={{ padding: "24px 32px", borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--bg-secondary) 50%, transparent)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Personal Profile</h3>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>How you appear to your team</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "12px 16px" }}>
          {sections[0].items.map((item, i) => (
            <div 
              key={item.label} 
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 9999, transition: "background-color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--bg-tertiary) 40%, transparent)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ height: 40, width: 40, borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                  <item.icon size={18} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</p>
                </div>
              </div>
              {item.badge ? (
                <span className="eth-badge eth-badge-brand" style={{ borderRadius: 9999, padding: "6px 16px", fontSize: 12 }}>{item.value}</span>
              ) : (
                <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" }}>{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="eth-fade-in-up" style={{ ...glassStyle, animationDelay: "0.2s" }}>
        <div style={{ padding: "24px 32px", borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--bg-secondary) 50%, transparent)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>App Preferences</h3>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>Customize your experience</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "12px 16px" }}>
          
          {/* Theme */}
          <div 
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 9999, transition: "background-color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--bg-tertiary) 40%, transparent)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ height: 40, width: 40, borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Appearance</p>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{theme === "light" ? "Light mode active" : "Dark mode active"}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{ position: "relative", width: 56, height: 28, borderRadius: 9999, border: "none", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", backgroundColor: theme === "dark" ? "var(--brand)" : "var(--bg-tertiary)", boxShadow: theme === "dark" ? "0 4px 12px rgba(99,102,241,0.4)" : "inset 0 2px 4px rgba(0,0,0,0.1)" }}
            >
              <span style={{ position: "absolute", top: 2, left: 2, height: 24, width: 24, borderRadius: "50%", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", transform: theme === "dark" ? "translateX(28px)" : "translateX(0)" }} />
            </button>
          </div>

          {/* Notifications */}
          <div 
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 9999, transition: "background-color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--bg-tertiary) 40%, transparent)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ height: 40, width: 40, borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <Bell size={18} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>In-app Notifications</p>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Toast alerts for all actions</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              style={{ position: "relative", width: 56, height: 28, borderRadius: 9999, border: "none", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", backgroundColor: notificationsEnabled ? "var(--brand)" : "var(--bg-tertiary)", boxShadow: notificationsEnabled ? "0 4px 12px rgba(99,102,241,0.4)" : "inset 0 2px 4px rgba(0,0,0,0.1)" }}
            >
              <span style={{ position: "absolute", top: 2, left: 2, height: 24, width: 24, borderRadius: "50%", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", transform: notificationsEnabled ? "translateX(28px)" : "translateX(0)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="eth-fade-in-up" style={{ ...glassStyle, animationDelay: "0.3s" }}>
        <div style={{ padding: "24px 32px", borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--bg-secondary) 50%, transparent)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Security</h3>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>Manage account safety</p>
        </div>
        <div style={{ padding: "12px 16px" }}>
          <div 
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 9999, transition: "background-color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--bg-tertiary) 40%, transparent)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ height: 40, width: 40, borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <Lock size={18} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Password settings</p>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Last changed: Just now</p>
              </div>
            </div>
            <button className="eth-btn eth-btn-secondary" style={{ borderRadius: 9999, padding: "8px 24px" }}>Change</button>
          </div>
        </div>
      </div>

      {/* Account info footer */}
      <div style={{ textAlign: "center", padding: "16px 0", opacity: 0.5 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)" }}>
          Account created {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "recently"}
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
