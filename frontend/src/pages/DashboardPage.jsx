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
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
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
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {getTimeOfDay()}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        {[
          {
            label: "Total tasks",
            value: stats.total,
            icon: ListTodo,
            color: "var(--info)",
            bg: "var(--info-muted)",
          },
          {
            label: "Completed",
            value: stats.done,
            icon: CheckCircle2,
            color: "var(--success)",
            bg: "var(--success-muted)",
          },
          {
            label: "In progress",
            value: stats.inProgress,
            icon: Clock,
            color: "var(--warning)",
            bg: "var(--warning-muted)",
          },
          {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            color: "var(--danger)",
            bg: "var(--danger-muted)",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {stat.label}
              </span>
              <div
                className="h-8 w-8 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
            </div>
            <span className="text-2xl font-semibold tracking-tight">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Progress + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Progress card */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Completion rate</h3>
            <div className="badge badge-brand">
              <TrendingUp size={11} />
              {completionRate}%
            </div>
          </div>

          {/* Circular progress */}
          <div className="flex items-center justify-center py-4">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="var(--brand-primary)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - completionRate / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tracking-tight">
                  {completionRate}%
                </span>
                <span className="text-[0.6875rem] text-[var(--text-tertiary)]">
                  complete
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-primary)]">
            <div className="text-center">
              <p className="text-lg font-semibold">{stats.done}</p>
              <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
                Done
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{stats.pending}</p>
              <p className="text-[0.6875rem] text-[var(--text-tertiary)]">
                Remaining
              </p>
            </div>
          </div>
        </div>

        {/* Recent tasks */}
        <div className="lg:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent tasks</h3>
            <Link
              to="/tasks"
              className="text-xs font-medium text-[var(--brand-primary)] hover:underline flex items-center gap-1"
            >
              View all
              <ArrowUpRight size={12} />
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div className="space-y-1">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] hover:bg-[var(--bg-tertiary)] transition-colors group"
                >
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      task.status === "done"
                        ? "bg-[var(--success)]"
                        : task.status === "in-progress"
                          ? "bg-[var(--warning)]"
                          : "bg-[var(--text-tertiary)]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.status === "done"
                          ? "line-through text-[var(--text-tertiary)]"
                          : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[0.6875rem] text-[var(--text-tertiary)] truncate">
                      {task.projectId?.name || "No project"}
                    </p>
                  </div>
                  <span
                    className={`badge shrink-0 ${
                      task.status === "done"
                        ? "badge-success"
                        : task.status === "in-progress"
                          ? "badge-warning"
                          : "badge-info"
                    }`}
                  >
                    {task.status === "in-progress" ? "Active" : task.status === "done" ? "Done" : "To do"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <ListTodo
                size={32}
                className="mx-auto mb-2 text-[var(--text-tertiary)]"
              />
              <p className="text-sm text-[var(--text-secondary)]">
                No tasks yet.{" "}
                <Link
                  to="/tasks"
                  className="text-[var(--brand-primary)] hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Calendar size={15} className="text-[var(--text-secondary)]" />
            Upcoming deadlines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingDeadlines.map((task) => {
              const daysLeft = Math.ceil(
                (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={task._id}
                  className="p-3 rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-primary)]"
                >
                  <p className="text-sm font-medium truncate mb-1">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.6875rem] text-[var(--text-tertiary)]">
                      {new Date(task.dueDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`text-[0.6875rem] font-medium ${
                        daysLeft <= 2
                          ? "text-[var(--danger)]"
                          : daysLeft <= 5
                            ? "text-[var(--warning)]"
                            : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {daysLeft === 0
                        ? "Today"
                        : daysLeft === 1
                          ? "Tomorrow"
                          : `${daysLeft} days`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
