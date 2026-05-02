import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, ListTodo, Calendar, User, Box, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
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

  if (loading) return <Loader text="Loading tasks..." />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-[var(--text-secondary)]">Manage and track your team's assignments.</p>
        </div>
        {user?.role === "admin" && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
          >
            {showForm ? "Cancel" : <><Plus size={20} /> Create New Task</>}
          </button>
        )}
      </div>

      {showForm && user?.role === "admin" && (
        <div className="premium-card p-6 md:p-8 animate-fade-in">
          <form onSubmit={createTask} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Task Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  <input
                    required
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Provide some context for this task..."
                rows={3}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Assign To</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  <select
                    required
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all appearance-none"
                  >
                    <option value="">Select a team member</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Project</label>
                <div className="relative">
                  <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  <select
                    required
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all appearance-none"
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
              Confirm Task Creation
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task, index) => (
          <div 
            key={task._id} 
            className="premium-card p-6 animate-fade-in group hover:border-[var(--accent-primary)]"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  task.status === "done" ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                }`}>
                  {task.status === "done" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div>
                  <h4 className="text-lg font-bold group-hover:text-[var(--accent-primary)] transition-colors">{task.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] max-w-2xl">{task.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-4 items-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5 bg-[var(--bg-primary)] px-2 py-1 rounded-md">
                      <Box size={14} /> {task.projectId?.name || "No Project"}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[var(--bg-primary)] px-2 py-1 rounded-md">
                      <User size={14} /> {task.assignedTo?.name || "Unassigned"}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[var(--bg-primary)] px-2 py-1 rounded-md">
                      <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative group/select">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-xs font-bold uppercase tracking-widest outline-none transition-all focus:ring-2 focus:ring-[var(--accent-primary)]/20 ${
                      task.status === "done" ? "text-green-600" : task.status === "in-progress" ? "text-blue-600" : "text-amber-600"
                    }`}
                  >
                    <option value="todo">TODO</option>
                    <option value="in-progress">IN PROGRESS</option>
                    <option value="done">DONE</option>
                  </select>
                </div>
                <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!tasks.length && (
          <div className="premium-card border-dashed p-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] mb-6">
              <ListTodo size={40} />
            </div>
            <h4 className="text-xl font-bold">No tasks assigned</h4>
            <p className="text-[var(--text-secondary)]">The workspace is currently clear. Take a moment to relax!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
