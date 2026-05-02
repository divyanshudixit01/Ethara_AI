import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Skeleton, { StatSkeleton, CardSkeleton } from "../components/Skeleton";

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks");
        setTasks(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const done = tasks.filter((t) => t.status === "done").length;
    const pending = tasks.filter((t) => t.status !== "done").length;
    const overdue = tasks.filter(
      (t) => t.status !== "done" && new Date(t.dueDate) < now
    ).length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;

    return { total: tasks.length, done, pending, overdue, inProgress };
  }, [tasks]);

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((stats.done / tasks.length) * 100);
  }, [tasks, stats]);

  const recentTasks = useMemo(() => {
    return [...tasks].slice(0, 5);
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return tasks
      .filter((t) => t.status !== "done" && new Date(t.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [tasks]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Skeleton style={{ height: 28, width: 192, borderRadius: 9999 }} />
          <Skeleton style={{ height: 16, width: 288, borderRadius: 9999 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const getTimeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const glassStyle = {
    backgroundColor: "color-mix(in srgb, var(--bg-secondary) 70%, transparent)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
    boxShadow: "0 8px 32px -4px rgba(0,0,0,0.03)",
    borderRadius: 32,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Greeting */}
      <div className="eth-fade-in-up" style={{ paddingLeft: 8 }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={24} style={{ color: "var(--brand)" }} />
          {getTimeOfDay()}, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 6 }}>
          Here&apos;s a quick overview of your workspace today.
        </p>
      </div>

      {/* Stats */}
      <div className="eth-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Total tasks", value: stats.total, icon: ListTodo, color: "var(--clr-info)", bg: "var(--clr-info-bg)" },
          { label: "Completed", value: stats.done, icon: CheckCircle2, color: "var(--clr-success)", bg: "var(--clr-success-bg)" },
          { label: "In progress", value: stats.inProgress, icon: Clock, color: "var(--clr-warning)", bg: "var(--clr-warning-bg)" },
          { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "var(--clr-danger)", bg: "var(--clr-danger-bg)" },
        ].map((stat) => (
          <div 
            key={stat.label} 
            style={{ ...glassStyle, padding: 24, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "space-between" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px -8px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px -4px rgba(0,0,0,0.03)";
            }}
          >
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", marginTop: 4 }}>{stat.value}</div>
            </div>
            <div style={{ height: 48, width: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "color-mix(in srgb, var(--bg-primary) 50%, transparent)" }}>
              <div style={{ height: 32, width: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: stat.bg }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress + Upcoming */}
      <div className="lg:grid-cols-5 eth-stagger" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        {/* Progress card */}
        <div className="lg:col-span-2" style={{ ...glassStyle, padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Completion Velocity</h3>
            <div className="eth-badge eth-badge-brand" style={{ borderRadius: 9999, padding: "6px 12px" }}>
              <TrendingUp size={12} /> {completionRate}%
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0", position: "relative" }}>
            <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "var(--brand)", filter: "blur(40px)", opacity: 0.1 }} />
            <div style={{ position: "relative", height: 160, width: 160 }}>
              <svg style={{ height: 160, width: 160, transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 8px rgba(99, 102, 241, 0.2))" }} viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" strokeLinecap="round" opacity="0.5" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="var(--brand)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - completionRate / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em" }}>{completionRate}%</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>done</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingTop: 24, marginTop: 16, borderTop: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}>
            <div style={{ textAlign: "center", padding: 12, backgroundColor: "var(--bg-primary)", borderRadius: 24 }}>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{stats.done}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Tasks Done</p>
            </div>
            <div style={{ textAlign: "center", padding: 12, backgroundColor: "var(--bg-primary)", borderRadius: 24 }}>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{stats.pending}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Remaining</p>
            </div>
          </div>
        </div>

        {/* Recent tasks */}
        <div className="lg:col-span-3" style={{ ...glassStyle, padding: 32, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Active Workspace</h3>
            <Link to="/tasks" style={{ fontSize: 13, fontWeight: 600, color: "var(--brand)", display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "6px 16px", backgroundColor: "var(--brand-muted)", borderRadius: 9999 }}>
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "12px 16px",
                    borderRadius: 9999, transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    backgroundColor: "color-mix(in srgb, var(--bg-primary) 50%, transparent)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-primary)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--bg-primary) 50%, transparent)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ height: 32, width: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: task.status === "done" ? "var(--clr-success-bg)" : task.status === "in-progress" ? "var(--clr-warning-bg)" : "var(--bg-tertiary)", flexShrink: 0 }}>
                    <div style={{ height: 10, width: 10, borderRadius: "50%", backgroundColor: task.status === "done" ? "var(--clr-success)" : task.status === "in-progress" ? "var(--clr-warning)" : "var(--text-tertiary)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: task.status === "done" ? "var(--text-tertiary)" : "var(--text-primary)", textDecoration: task.status === "done" ? "line-through" : "none" }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                      {task.projectId?.name || "No project"}
                    </p>
                  </div>
                  <span className={`eth-badge flex-shrink-0 ${task.status === "done" ? "eth-badge-success" : task.status === "in-progress" ? "eth-badge-warning" : "eth-badge-info"}`} style={{ borderRadius: 9999, padding: "4px 10px" }}>
                    {task.status === "in-progress" ? "Active" : task.status === "done" ? "Done" : "To do"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "48px 0", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ height: 64, width: 64, borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <ListTodo size={28} style={{ color: "var(--text-tertiary)" }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" }}>
                Workspace is clean. <Link to="/tasks" style={{ color: "var(--brand)", textDecoration: "none" }}>Create a task</Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div style={{ ...glassStyle, padding: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <Calendar size={18} style={{ color: "var(--brand)" }} />
            Approaching Deadlines
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {upcomingDeadlines.map((task) => {
              const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div 
                  key={task._id} 
                  style={{ 
                    padding: 20, borderRadius: 24, 
                    border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", 
                    backgroundColor: "color-mix(in srgb, var(--bg-primary) 50%, transparent)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-primary)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--bg-primary) 50%, transparent)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <p style={{ fontSize: 15, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 12 }}>
                    {task.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "var(--bg-tertiary)", borderRadius: 9999 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)" }}>
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: daysLeft <= 2 ? "var(--clr-danger)" : daysLeft <= 5 ? "var(--clr-warning)" : "var(--brand)" }}>
                      {daysLeft <= 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} days`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <style>{`
        @media (min-width: 1024px) {
          .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
          .lg\\:col-span-2 { grid-column: span 2 / span 2 !important; }
          .lg\\:col-span-3 { grid-column: span 3 / span 3 !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
