import { useState } from "react";
import { User, Mail, Shield, Moon, Sun, Bell, Lock } from "lucide-react";
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 672 }}>
      <div>
        <h1 style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)", fontWeight: 600, letterSpacing: "-0.025em" }}>Settings</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 2 }}>Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div className="eth-card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Profile</h3>
          <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Your personal information</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {sections[0].items.map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ height: 32, width: 32, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                  <item.icon size={15} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</p>
                </div>
              </div>
              {item.badge ? (
                <span className="eth-badge eth-badge-brand">{item.value}</span>
              ) : (
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="eth-card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Preferences</h3>
          <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Customize your experience</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Theme */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ height: 32, width: 32, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                {theme === "light" ? <Sun size={15} /> : <Moon size={15} />}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>Appearance</p>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{theme === "light" ? "Light mode" : "Dark mode"}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{ position: "relative", width: 40, height: 20, borderRadius: 999, border: "none", cursor: "pointer", transition: "background-color 0.2s", backgroundColor: theme === "dark" ? "var(--brand)" : "var(--bg-tertiary)" }}
            >
              <span style={{ position: "absolute", top: 2, left: 2, height: 16, width: 16, borderRadius: "50%", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "transform 0.2s", transform: theme === "dark" ? "translateX(20px)" : "translateX(0)" }} />
            </button>
          </div>

          {/* Notifications */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ height: 32, width: 32, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <Bell size={15} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>Notifications</p>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Toast notifications for actions</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              style={{ position: "relative", width: 40, height: 20, borderRadius: 999, border: "none", cursor: "pointer", transition: "background-color 0.2s", backgroundColor: notificationsEnabled ? "var(--brand)" : "var(--bg-tertiary)" }}
            >
              <span style={{ position: "absolute", top: 2, left: 2, height: 16, width: 16, borderRadius: "50%", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "transform 0.2s", transform: notificationsEnabled ? "translateX(20px)" : "translateX(0)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="eth-card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Security</h3>
          <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Manage your security settings</p>
        </div>
        <div style={{ padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ height: 32, width: 32, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <Lock size={15} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>Password</p>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Last changed: Unknown</p>
              </div>
            </div>
            <button className="eth-btn eth-btn-secondary eth-btn-sm">Change</button>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
          Account created {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "recently"}
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
