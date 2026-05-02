import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, AlertCircle, LayoutList, ArrowUpRight, TrendingUp, Users, Activity } from "lucide-react";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Skeleton from "../components/Skeleton";

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

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100);
  }, [tasks]);

  if (loading) return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Mission Control</h2>
          <p className="text-[var(--text-secondary)] font-medium">Real-time workspace velocity and project health.</p>
        </div>
        <div className="flex items-center gap-4 p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
           <Activity className="text-green-500 animate-pulse" size={20} />
           <span className="text-xs font-black uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="premium-card p-10 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] h-64 w-64 bg-[var(--accent-primary)]/5 rounded-full blur-[80px] group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-100 text-[var(--accent-primary)] dark:bg-indigo-900/30">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Deployment Velocity</h3>
            </div>
            <div className="flex items-end gap-4 mb-8">
              <span className="text-7xl font-black tracking-tighter">{completionRate}%</span>
              <span className="text-lg font-bold text-[var(--text-secondary)] mb-2">Overall Completion</span>
            </div>
            <div className="w-full h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
               <div 
                 className="h-full bg-[var(--accent-primary)] transition-all duration-1000 ease-out shadow-lg shadow-indigo-500/40"
                 style={{ width: `${completionRate}%` }}
               ></div>
            </div>
          </div>
          <div className="mt-8 flex gap-8 relative z-10">
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60">Avg. Task Speed</span>
                <span className="text-lg font-black">2.4 Days</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60">Active Members</span>
                <span className="text-lg font-black">12 Operators</span>
             </div>
          </div>
        </div>

        <div className="premium-card p-10 bg-slate-900 text-white border-none flex flex-col justify-between group overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <Activity size={120} />
           </div>
           <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-2">Team Sync</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">Your workspace is 12% more active than last week.</p>
              
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                            {["A", "B", "C"][i-1]}
                         </div>
                         <span className="text-xs font-bold">Member {i}</span>
                      </div>
                      <span className="text-[10px] font-black text-green-400">ONLINE</span>
                   </div>
                 ))}
              </div>
           </div>
           <button className="mt-8 w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-sm transition-all hover:bg-slate-200 active:scale-95">
              Launch Team Huddle
           </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="premium-card p-8 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${stat.bg} transition-transform group-hover:scale-110`}></div>
            <div className="relative z-10">
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.text} shadow-inner`}>
                <stat.icon size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-60">{stat.label}</p>
              <h3 className="mt-2 text-4xl font-black tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tight">Deployment Pipeline</h3>
          <div className="flex gap-2 p-1.5 glass-effect rounded-2xl border border-[var(--border-color)]">
            {["all", "completed", "pending", "overdue"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === item 
                    ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-indigo-500/20" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredTasks.map((task, index) => (
            <div 
              key={task._id} 
              className="premium-card p-8 animate-fade-in group hover:border-[var(--accent-primary)]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <span className={`h-2 w-2 rounded-full ${task.status === "done" ? "bg-green-500" : "bg-amber-500"}`}></span>
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{task.projectId?.name || "Global"}</span>
                  </div>
                  <h4 className="font-black text-xl group-hover:text-[var(--accent-primary)] transition-colors tracking-tight">{task.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-medium">{task.description}</p>
                </div>
                <ArrowUpRight size={24} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 opacity-40 group-hover:opacity-100" />
              </div>
              
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                      {task.assignedTo?.name?.charAt(0) || "U"}
                   </div>
                   <span className="text-xs font-bold">{task.assignedTo?.name || "Unassigned"}</span>
                </div>
                <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] opacity-60 uppercase flex items-center gap-2">
                  <Clock size={12} />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}

          {!filteredTasks.length && (
            <div className="col-span-full premium-card border-dashed p-24 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--bg-primary)] text-[var(--text-secondary)] mb-6">
                <LayoutList size={48} />
              </div>
              <h4 className="text-2xl font-bold mb-2">No pipeline data</h4>
              <p className="text-[var(--text-secondary)] font-medium">Your current deployment pipeline is empty for this view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
