import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, AlertCircle, LayoutList, ArrowUpRight } from "lucide-react";
import { api } from "../api/api";
import Loader from "../components/Loader";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
    return [
      { 
        label: "Total Tasks", 
        value: tasks.length, 
        icon: LayoutList, 
        color: "bg-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400"
      },
      { 
        label: "Completed", 
        value: tasks.filter((t) => t.status === "done").length, 
        icon: CheckCircle2, 
        color: "bg-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-600 dark:text-green-400"
      },
      { 
        label: "Pending", 
        value: tasks.filter((t) => t.status !== "done").length, 
        icon: Clock, 
        color: "bg-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        text: "text-amber-600 dark:text-amber-400"
      },
      { 
        label: "Overdue", 
        value: tasks.filter((t) => t.status !== "done" && new Date(t.dueDate) < now).length, 
        icon: AlertCircle, 
        color: "bg-red-500",
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400"
      },
    ];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    if (filter === "completed") return tasks.filter((t) => t.status === "done");
    if (filter === "pending") return tasks.filter((t) => t.status !== "done");
    if (filter === "overdue") {
      return tasks.filter((t) => t.status !== "done" && new Date(t.dueDate) < now);
    }
    return tasks;
  }, [tasks, filter]);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-[var(--text-secondary)]">Track your team's progress and upcoming deadlines.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="premium-card p-6 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${stat.bg} transition-transform group-hover:scale-110`}></div>
            <div className="relative z-10">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.text}`}>
                <stat.icon size={24} />
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Recent Tasks</h3>
          <div className="flex gap-2 p-1 glass-effect rounded-xl">
            {["all", "completed", "pending", "overdue"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  filter === item 
                    ? "bg-[var(--accent-primary)] text-white shadow-md" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                }`}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTasks.map((task, index) => (
            <div 
              key={task._id} 
              className="premium-card p-6 animate-fade-in group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-lg group-hover:text-[var(--accent-primary)] transition-colors">{task.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{task.description}</p>
                </div>
                <ArrowUpRight size={20} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  task.status === "done" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {task.status}
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Clock size={12} />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}

          {!filteredTasks.length && (
            <div className="col-span-full premium-card border-dashed p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] mb-4">
                <LayoutList size={32} />
              </div>
              <h4 className="text-lg font-bold">No tasks found</h4>
              <p className="text-[var(--text-secondary)]">Try changing your filters or add new tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
