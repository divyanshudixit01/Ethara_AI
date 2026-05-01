import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
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
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "done").length,
      pending: tasks.filter((t) => t.status !== "done").length,
      overdue: tasks.filter((t) => t.status !== "done" && new Date(t.dueDate) < now).length,
    };
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm capitalize text-slate-500">{key}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "completed", "pending", "overdue"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-lg px-3 py-1 text-sm ${
              filter === item ? "bg-slate-900 text-white" : "bg-white border border-slate-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">{task.title}</p>
            <p className="text-sm text-slate-600">{task.description}</p>
            <p className="mt-2 text-xs text-slate-500">
              Status: {task.status} | Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        ))}
        {!filteredTasks.length && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No tasks found for this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
