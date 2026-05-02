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
        {
          icon: User,
          label: "Name",
          value: user?.name || "—",
        },
        {
          icon: Mail,
          label: "Email",
          value: user?.email || "—",
        },
        {
          icon: Shield,
          label: "Role",
          value: user?.role === "admin" ? "Administrator" : "Team Member",
          badge: true,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="px-5 py-4 border-b border-[var(--border-primary)]">
          <h3 className="text-sm font-semibold">Profile</h3>
          <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
            Your personal information
          </p>
        </div>
        <div className="divide-y divide-[var(--border-primary)]">
          {sections[0].items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                  <item.icon size={15} />
                </div>
                <div>
                  <p className="text-[0.8125rem] font-medium">{item.label}</p>
                </div>
              </div>
              {item.badge ? (
                <span className="badge badge-brand">{item.value}</span>
              ) : (
                <span className="text-sm text-[var(--text-secondary)]">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <div className="px-5 py-4 border-b border-[var(--border-primary)]">
          <h3 className="text-sm font-semibold">Preferences</h3>
          <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
            Customize your experience
          </p>
        </div>
        <div className="divide-y divide-[var(--border-primary)]">
          {/* Theme */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                {theme === "light" ? <Sun size={15} /> : <Moon size={15} />}
              </div>
              <div>
                <p className="text-[0.8125rem] font-medium">Appearance</p>
                <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
                  {theme === "light" ? "Light mode" : "Dark mode"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                theme === "dark"
                  ? "bg-[var(--brand-primary)]"
                  : "bg-[var(--border-primary)]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                <Bell size={15} />
              </div>
              <div>
                <p className="text-[0.8125rem] font-medium">Notifications</p>
                <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
                  Toast notifications for actions
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                notificationsEnabled
                  ? "bg-[var(--brand-primary)]"
                  : "bg-[var(--border-primary)]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="px-5 py-4 border-b border-[var(--border-primary)]">
          <h3 className="text-sm font-semibold">Security</h3>
          <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
            Manage your security settings
          </p>
        </div>
        <div className="px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                <Lock size={15} />
              </div>
              <div>
                <p className="text-[0.8125rem] font-medium">Password</p>
                <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
                  Last changed: Unknown
                </p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="text-center py-4">
        <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
          Account created{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "recently"}
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
