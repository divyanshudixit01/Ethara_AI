import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  ListTodo,
  Calendar,
  User,
  FolderKanban,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import { CardSkeleton } from "../components/Skeleton";

const statusConfig = {
  todo: { label: "To do", badge: "badge-info", dot: "bg-[var(--info)]" },
  "in-progress": { label: "In progress", badge: "badge-warning", dot: "bg-[var(--warning)]" },
  done: { label: "Done", badge: "badge-success", dot: "bg-[var(--success)]" },
};

const TasksPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const emptyForm = {
    title: "",
    description: "",
    assignedTo: "",
    projectId: "",
    status: "todo",
    dueDate: "",
  };
  const [form, setForm] = useState(emptyForm);

  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchData = async () => {
    try {
      const requests = [api.get("/tasks"), api.get("/projects")];
      if (isAdmin) requests.push(api.get("/users"));
      const [tasksRes, projectsRes, usersRes] = await Promise.all(requests);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (usersRes) setUsers(usersRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo?._id || "",
      projectId: task.projectId?._id || "",
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, form);
        toast.success("Task updated");
      } else {
        await api.post("/tasks", form);
        toast.success("Task created");
      }
      setForm(emptyForm);
      setEditingTask(null);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      toast.success("Status updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: tasks.length, todo: 0, "in-progress": 0, done: 0 };
    tasks.forEach((t) => counts[t.status]++);
    return counts;
  }, [tasks]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="skeleton h-7 w-32" />
          <div className="skeleton h-4 w-56" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Tasks
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {tasks.length} total · {statusCounts.done} completed
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} />
            New task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-9"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[var(--radius-md)]">
          {["all", "todo", "in-progress", "done"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors ${
                statusFilter === status
                  ? "bg-[var(--brand-primary)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "in-progress"
                  ? "Active"
                  : status === "todo"
                    ? "To do"
                    : "Done"}
              <span className="ml-1 opacity-60">{statusCounts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2 stagger-children">
        {filteredTasks.map((task) => {
          const isOverdue =
            task.status !== "done" && new Date(task.dueDate) < new Date();
          const cfg = statusConfig[task.status];

          return (
            <div
              key={task._id}
              className="card-interactive p-4 flex items-start gap-3 group"
            >
              {/* Status indicator */}
              <button
                onClick={() => {
                  const next =
                    task.status === "todo"
                      ? "in-progress"
                      : task.status === "in-progress"
                        ? "done"
                        : "todo";
                  updateStatus(task._id, next);
                }}
                className="mt-0.5 shrink-0 text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors"
                title="Click to change status"
              >
                {task.status === "done" ? (
                  <CheckCircle2 size={18} className="text-[var(--success)]" />
                ) : task.status === "in-progress" ? (
                  <Clock size={18} className="text-[var(--warning)]" />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-medium ${
                        task.status === "done"
                          ? "line-through text-[var(--text-tertiary)]"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-[0.8125rem] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Actions menu */}
                  {(isAdmin || String(task.assignedTo?._id) === String(user?.id)) && (
                    <div className="relative shrink-0">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === task._id ? null : task._id)
                        }
                        className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {openMenuId === task._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 w-36 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[var(--radius-md)] shadow-lg py-1 animate-scale-in">
                            <button
                              onClick={() => openEditModal(task)}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-[0.8125rem] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setDeleteConfirm(task._id);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-1.5 text-[0.8125rem] text-[var(--danger)] hover:bg-[var(--danger-muted)] transition-colors"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`badge ${cfg.badge}`}>{cfg.label}</span>

                  {task.projectId?.name && (
                    <span className="flex items-center gap-1 text-[0.6875rem] text-[var(--text-tertiary)]">
                      <FolderKanban size={11} />
                      {task.projectId.name}
                    </span>
                  )}

                  <span className="flex items-center gap-1 text-[0.6875rem] text-[var(--text-tertiary)]">
                    <User size={11} />
                    {task.assignedTo?.name || "Unassigned"}
                  </span>

                  <span
                    className={`flex items-center gap-1 text-[0.6875rem] ${
                      isOverdue
                        ? "text-[var(--danger)] font-medium"
                        : "text-[var(--text-tertiary)]"
                    }`}
                  >
                    <Calendar size={11} />
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    {isOverdue && " · Overdue"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="card p-12 text-center">
            <ListTodo
              size={36}
              className="mx-auto mb-3 text-[var(--text-tertiary)]"
            />
            <h4 className="text-sm font-semibold mb-1">No tasks found</h4>
            <p className="text-[0.8125rem] text-[var(--text-secondary)]">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters."
                : isAdmin
                  ? "Create your first task to get started."
                  : "No tasks assigned to you yet."}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit task" : "New task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className="input-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium">
              Description{" "}
              <span className="text-[var(--text-tertiary)] font-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Add more details..."
              rows={3}
              className="input-base resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium">Assignee</label>
              <select
                required
                value={form.assignedTo}
                onChange={(e) =>
                  setForm({ ...form, assignedTo: e.target.value })
                }
                className="input-base"
              >
                <option value="">Select person</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium">Project</label>
              <select
                required
                value={form.projectId}
                onChange={(e) =>
                  setForm({ ...form, projectId: e.target.value })
                }
                className="input-base"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium">Due date</label>
              <input
                required
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
                className="input-base"
              />
            </div>

            {editingTask && (
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="input-base"
                >
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-[2]">
              {editingTask ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete task"
        size="sm"
      >
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteTask(deleteConfirm)}
            className="btn btn-danger flex-1"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;
