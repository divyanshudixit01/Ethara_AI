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
          <Skeleton style={{ height: 28, width: 192 }} />
          <Skeleton style={{ height: 16, width: 288 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <StatSkeleton key={i} />
          ))}
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)", fontWeight: 600, letterSpacing: "-0.025em" }}>
          {getTimeOfDay()}, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 2 }}>
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      {/* Stats */}
      <div className="eth-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { label: "Total tasks", value: stats.total, icon: ListTodo, color: "var(--clr-info)", bg: "var(--clr-info-bg)" },
          { label: "Completed", value: stats.done, icon: CheckCircle2, color: "var(--clr-success)", bg: "var(--clr-success-bg)" },
          { label: "In progress", value: stats.inProgress, icon: Clock, color: "var(--clr-warning)", bg: "var(--clr-warning-bg)" },
          { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "var(--clr-danger)", bg: "var(--clr-danger-bg)" },
        ].map((stat) => (
          <div key={stat.label} className="eth-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{stat.label}</span>
              <div style={{ height: 32, width: 32, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: stat.bg }}>
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
            </div>
            <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.025em" }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Progress + Upcoming */}
      <div className="lg:grid-cols-5" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        {/* Progress card */}
        <div className="eth-card lg:col-span-2" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Completion rate</h3>
            <div className="eth-badge eth-badge-brand">
              <TrendingUp size={11} /> {completionRate}%
            </div>
          </div>

          {/* Circular progress */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
            <div style={{ position: "relative", height: 128, width: 128 }}>
              <svg style={{ height: 128, width: 128, transform: "rotate(-90deg)" }} viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="var(--brand)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - completionRate / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>{completionRate}%</span>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>complete</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 600 }}>{stats.done}</p>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Done</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 600 }}>{stats.pending}</p>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Remaining</p>
            </div>
          </div>
        </div>

        {/* Recent tasks */}
        <div className="eth-card lg:col-span-3" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent tasks</h3>
            <Link to="/tasks" style={{ fontSize: 12, fontWeight: 500, color: "var(--brand)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: 10,
                    borderRadius: "var(--radius-md)", transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div
                    style={{
                      height: 8, width: 8, borderRadius: "50%", flexShrink: 0,
                      backgroundColor: task.status === "done" ? "var(--clr-success)" : task.status === "in-progress" ? "var(--clr-warning)" : "var(--text-tertiary)"
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        color: task.status === "done" ? "var(--text-tertiary)" : "inherit",
                        textDecoration: task.status === "done" ? "line-through" : "none"
                      }}
                    >
                      {task.title}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {task.projectId?.name || "No project"}
                    </p>
                  </div>
                  <span className={`eth-badge flex-shrink-0 ${task.status === "done" ? "eth-badge-success" : task.status === "in-progress" ? "eth-badge-warning" : "eth-badge-info"}`}>
                    {task.status === "in-progress" ? "Active" : task.status === "done" ? "Done" : "To do"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <ListTodo size={32} style={{ margin: "0 auto 8px", color: "var(--text-tertiary)" }} />
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                No tasks yet. <Link to="/tasks" style={{ color: "var(--brand)", textDecoration: "none" }}>Create one</Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="eth-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={15} style={{ color: "var(--text-secondary)" }} />
            Upcoming deadlines
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {upcomingDeadlines.map((task) => {
              const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={task._id} style={{ padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>
                    {task.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: daysLeft <= 2 ? "var(--clr-danger)" : daysLeft <= 5 ? "var(--clr-warning)" : "var(--text-secondary)" }}>
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
