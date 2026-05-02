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
  todo: { label: "To do", badge: "eth-badge-info", dot: "var(--clr-info)" },
  "in-progress": { label: "In progress", badge: "eth-badge-warning", dot: "var(--clr-warning)" },
  done: { label: "Done", badge: "eth-badge-success", dot: "var(--clr-success)" },
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

  const emptyForm = { title: "", description: "", assignedTo: "", projectId: "", status: "todo", dueDate: "" };
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

  useEffect(() => { if (user) fetchData(); }, [user]);

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
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
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
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div className="eth-skeleton" style={{ height: 28, width: 128 }} />
          <div className="eth-skeleton" style={{ height: 16, width: 224 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)", fontWeight: 600, letterSpacing: "-0.025em" }}>Tasks</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{tasks.length} total · {statusCounts.done} completed</p>
        </div>
        {isAdmin && (
          <button onClick={openCreateModal} className="eth-btn eth-btn-primary">
            <Plus size={16} /> New task
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="eth-input" style={{ paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 4, backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          {["all", "todo", "in-progress", "done"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.15s, color 0.15s",
                backgroundColor: statusFilter === status ? "var(--brand)" : "transparent",
                color: statusFilter === status ? "#fff" : "var(--text-secondary)",
              }}
            >
              {status === "all" ? "All" : status === "in-progress" ? "Active" : status === "todo" ? "To do" : "Done"}
              <span style={{ marginLeft: 4, opacity: 0.6 }}>{statusCounts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="eth-stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredTasks.map((task) => {
          const isOverdue = task.status !== "done" && new Date(task.dueDate) < new Date();
          const cfg = statusConfig[task.status];

          return (
            <div key={task._id} className="eth-card-hover" style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 12, position: "relative" }}>
              {/* Status indicator */}
              <button
                onClick={() => updateStatus(task._id, task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo")}
                style={{ marginTop: 2, background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 0 }}
                title="Click to change status"
              >
                {task.status === "done" ? <CheckCircle2 size={18} color="var(--clr-success)" /> : task.status === "in-progress" ? <Clock size={18} color="var(--clr-warning)" /> : <Circle size={18} />}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 500, textDecoration: task.status === "done" ? "line-through" : "none", color: task.status === "done" ? "var(--text-tertiary)" : "inherit" }}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Actions menu */}
                  {(isAdmin || String(task.assignedTo?._id) === String(user?.id)) && (
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
                        style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", border: "none", background: "transparent", color: "var(--text-tertiary)", cursor: "pointer" }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {openMenuId === task._id && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpenMenuId(null)} />
                          <div className="eth-scale-in" style={{ position: "absolute", right: 0, top: 32, zIndex: 20, width: 144, backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--card-shadow)", padding: "4px 0" }}>
                            <button onClick={() => openEditModal(task)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 12px", fontSize: 13, color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                              <Pencil size={13} /> Edit
                            </button>
                            {isAdmin && (
                              <button onClick={() => { setDeleteConfirm(task._id); setOpenMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 12px", fontSize: 13, color: "var(--clr-danger)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--clr-danger-bg)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
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
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <span className={`eth-badge ${cfg.badge}`}>{cfg.label}</span>
                  {task.projectId?.name && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-tertiary)" }}>
                      <FolderKanban size={11} /> {task.projectId.name}
                    </span>
                  )}
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-tertiary)" }}>
                    <User size={11} /> {task.assignedTo?.name || "Unassigned"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: isOverdue ? "var(--clr-danger)" : "var(--text-tertiary)", fontWeight: isOverdue ? 500 : 400 }}>
                    <Calendar size={11} /> {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} {isOverdue && " · Overdue"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="eth-card" style={{ padding: 48, textAlign: "center" }}>
            <ListTodo size={36} style={{ margin: "0 auto 12px", color: "var(--text-tertiary)" }} />
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No tasks found</h4>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {searchQuery || statusFilter !== "all" ? "Try adjusting your filters." : isAdmin ? "Create your first task to get started." : "No tasks assigned to you yet."}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} title={editingTask ? "Edit task" : "New task"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" className="eth-input" />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Description <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add more details..." rows={3} className="eth-input" style={{ resize: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Assignee</label>
              <select required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="eth-input">
                <option value="">Select person</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Project</label>
              <select required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="eth-input">
                <option value="">Select project</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Due date</label>
              <input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="eth-input" />
            </div>
            {editingTask && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="eth-input">
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <button type="button" onClick={() => { setIsModalOpen(false); setEditingTask(null); }} className="eth-btn eth-btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="eth-btn eth-btn-primary" style={{ flex: 2 }}>{editingTask ? "Save changes" : "Create task"}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete task" size="sm">
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>Are you sure you want to delete this task? This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setDeleteConfirm(null)} className="eth-btn eth-btn-secondary" style={{ flex: 1 }}>Cancel</button>
          <button onClick={() => deleteTask(deleteConfirm)} className="eth-btn eth-btn-danger" style={{ flex: 1 }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;
