import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.success("Task created");
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        projectId: "",
        status: "todo",
        dueDate: "",
      });
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Tasks</h2>

      {user?.role === "admin" && (
        <form onSubmit={createTask} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Task title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <select
              required
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Assign to</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            <select
              required
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              required
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
            Create Task
          </button>
        </form>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{task.title}</p>
                <p className="text-sm text-slate-600">{task.description}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Project: {task.projectId?.name} | Assignee: {task.assignedTo?.name} | Due:{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="todo">todo</option>
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
