import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, ListTodo, Calendar, User, Box, ArrowRight, CheckCircle2, Circle, Search, Filter, MoreVertical } from "lucide-react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { CardSkeleton } from "../components/Skeleton";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projectId: "",
    status: "todo",
    dueDate: "",
  });

  const fetchData = async () => {
    try {
      const requests = [api.get("/tasks"), api.get("/projects")];
      if (user?.role === "admin") requests.push(api.get("/users"));
      const [tasksRes, projectsRes, usersRes] = await Promise.all(requests);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (usersRes) setUsers(usersRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", form);
      toast.success("Task created successfully");
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        projectId: "",
        status: "todo",
        dueDate: "",
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      toast.success("Status updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Center</h2>
          <p className="text-[var(--text-secondary)] font-medium">Efficiently manage and distribute your team's workflow.</p>
        </div>
        {user?.role === "admin" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-8 py-4 font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
            Create High-Priority Task
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
          <Filter size={16} className="ml-3 text-[var(--text-secondary)]" />
          <div className="flex gap-1">
            {["all", "todo", "in-progress", "done"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === status 
                    ? "bg-[var(--accent-primary)] text-white shadow-md" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {filteredTasks.map((task, index) => (
          <div 
            key={task._id} 
            className="premium-card p-6 flex flex-col group animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                task.status === "done" ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"
              }`}>
                {task.status === "done" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-bold group-hover:text-[var(--accent-primary)] transition-colors mb-2">{task.title}</h4>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-6 font-medium">{task.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-60">Project</span>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Box size={14} className="text-[var(--accent-primary)]" />
                    <span className="truncate">{task.projectId?.name || "Unassigned"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-60">Assignee</span>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] text-indigo-600">
                      {task.assignedTo?.name?.charAt(0) || <User size={10} />}
                    </div>
                    <span className="truncate">{task.assignedTo?.name || "Open"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                <Calendar size={14} />
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="relative">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                  className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer hover:border-[var(--accent-primary)] ${
                    task.status === "done" ? "text-green-600 border-green-200" : task.status === "in-progress" ? "text-blue-600 border-blue-200" : "text-amber-600 border-amber-200"
                  }`}
                >
                  <option value="todo">TODO</option>
                  <option value="in-progress">IN PROGRESS</option>
                  <option value="done">DONE</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {!filteredTasks.length && (
          <div className="col-span-full premium-card border-dashed p-20 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--bg-primary)] text-[var(--text-secondary)] mb-6">
              <ListTodo size={48} />
            </div>
            <h4 className="text-2xl font-bold mb-2">No results found</h4>
            <p className="text-[var(--text-secondary)] font-medium">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Initialize New Task"
      >
        <form onSubmit={createTask} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Task Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Implement real-time notifications"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Context & Objectives</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide a detailed brief for the assignee..."
              rows={4}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all resize-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Lead Assignee</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <select
                  required
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all appearance-none font-medium"
                >
                  <option value="">Select individual</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Target Project</label>
              <div className="relative">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <select
                  required
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all appearance-none font-medium"
                >
                  <option value="">Link to project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
              <input
                required
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-slate-900 dark:bg-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
            >
              Deploy Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksPage;
