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
  Sparkles
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
      // Anyone can fetch users and projects now for assigning tasks!
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
        api.get("/users")
      ]);
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
      if (!form.assignedTo || !form.projectId) {
        return toast.error("Please assign a user and a project");
      }

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, form);
        toast.success("Task updated successfully");
      } else {
        await api.post("/tasks", form);
        toast.success("Task created beautifully");
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 24,
        position: "relative",
        minHeight: "calc(100vh - 120px)"
      }}
    >
      {/* Background ambient gradient */}
      <div 
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "600px",
          background: "radial-gradient(circle, var(--brand-subtle) 0%, transparent 60%)",
          opacity: 0.15,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Header */}
      <div className="eth-fade-in-up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={24} style={{ color: "var(--brand)" }} />
            Tasks Pipeline
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
            {tasks.length} total · {statusCounts.done} completed beautifully.
          </p>
        </div>
        
        {/* ANY user can now create tasks! */}
        <button 
          onClick={openCreateModal} 
          className="eth-btn eth-btn-primary eth-scale-in"
          style={{ borderRadius: 9999, padding: "10px 20px", boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)" }}
        >
          <Plus size={16} /> New task
        </button>
      </div>

      {/* Filters (Glassmorphic Pill) */}
      <div 
        className="eth-fade-in-up"
        style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 12,
          padding: 8,
          borderRadius: 9999,
          backgroundColor: "color-mix(in srgb, var(--bg-secondary) 60%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
          boxShadow: "0 4px 24px -1px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={15} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "none",
              padding: "10px 14px 10px 40px",
              fontSize: 14,
              color: "var(--text-primary)",
              outline: "none"
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingRight: 4 }}>
          {["all", "todo", "in-progress", "done"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 9999,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: statusFilter === status ? "var(--text-primary)" : "transparent",
                color: statusFilter === status ? "var(--bg-primary)" : "var(--text-secondary)",
              }}
            >
              {status === "all" ? "All" : status === "in-progress" ? "Active" : status === "todo" ? "To do" : "Done"}
              <span style={{ marginLeft: 6, opacity: statusFilter === status ? 0.8 : 0.5, fontSize: 11 }}>{statusCounts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="eth-stagger" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {filteredTasks.map((task) => {
          const isOverdue = task.status !== "done" && new Date(task.dueDate) < new Date();
          const cfg = statusConfig[task.status];

          return (
            <div 
              key={task._id} 
              style={{ 
                padding: "16px 20px", 
                display: "flex", 
                alignItems: "center", 
                gap: 16, 
                position: "relative",
                borderRadius: 9999,
                backgroundColor: "color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
                boxShadow: "0 2px 10px -1px rgba(0,0,0,0.02)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.005)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)";
                e.currentTarget.style.borderColor = "var(--brand-subtle)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 10px -1px rgba(0,0,0,0.02)";
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--border) 50%, transparent)";
              }}
            >
              {/* Status indicator (Interactive) */}
              <button
                onClick={() => updateStatus(task._id, task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo")}
                style={{ 
                  background: "var(--bg-primary)", 
                  border: "1px solid var(--border)", 
                  height: 32, 
                  width: 32,
                  borderRadius: "50%",
                  cursor: "pointer", 
                  color: "var(--text-tertiary)", 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                title="Click to change status"
              >
                {task.status === "done" ? <CheckCircle2 size={16} color="var(--clr-success)" /> : task.status === "in-progress" ? <Clock size={16} color="var(--clr-warning)" /> : <Circle size={16} />}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                
                <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: 16 }}>
                  <h4 
                    style={{ 
                      fontSize: 15, 
                      fontWeight: 500, 
                      textDecoration: task.status === "done" ? "line-through" : "none", 
                      color: task.status === "done" ? "var(--text-tertiary)" : "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "250px"
                    }}
                  >
                    {task.title}
                  </h4>
                  
                  {/* Meta Pills inside the row */}
                  <div className="hidden sm:flex" style={{ flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                    <span className={`eth-badge ${cfg.badge}`} style={{ borderRadius: 9999 }}>{cfg.label}</span>
                    {task.projectId?.name && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-tertiary)", padding: "4px 10px", backgroundColor: "var(--bg-tertiary)", borderRadius: 9999 }}>
                        <FolderKanban size={12} /> {task.projectId.name}
                      </span>
                    )}
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-tertiary)", padding: "4px 10px", backgroundColor: "var(--bg-tertiary)", borderRadius: 9999 }}>
                      <User size={12} /> {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: isOverdue ? "var(--clr-danger)" : "var(--text-tertiary)", fontWeight: isOverdue ? 600 : 500 }}>
                    <Calendar size={13} /> {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>

                  {/* Actions menu */}
                  {(isAdmin || String(task.assignedTo?._id) === String(user?.id)) && (
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
                        style={{ height: 32, width: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", background: "var(--bg-tertiary)", color: "var(--text-secondary)", cursor: "pointer", transition: "background 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--border)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-tertiary)"}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {openMenuId === task._id && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpenMenuId(null)} />
                          <div className="eth-scale-in" style={{ position: "absolute", right: 0, top: 40, zIndex: 20, width: 144, backgroundColor: "color-mix(in srgb, var(--bg-secondary) 90%, transparent)", backdropFilter: "blur(12px)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", padding: "6px" }}>
                            <button onClick={() => openEditModal(task)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", fontSize: 13, fontWeight: 500, color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderRadius: "var(--radius-sm)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                              <Pencil size={14} /> Edit Task
                            </button>
                            {isAdmin && (
                              <button onClick={() => { setDeleteConfirm(task._id); setOpenMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", fontSize: 13, fontWeight: 500, color: "var(--clr-danger)", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderRadius: "var(--radius-sm)", marginTop: 2 }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--clr-danger-bg)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                <Trash2 size={14} /> Delete
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="eth-scale-in" style={{ padding: 64, textAlign: "center", backgroundColor: "color-mix(in srgb, var(--bg-secondary) 50%, transparent)", backdropFilter: "blur(10px)", border: "1px dashed var(--border)", borderRadius: 32 }}>
            <div style={{ height: 64, width: 64, margin: "0 auto 16px", borderRadius: "50%", backgroundColor: "var(--brand-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ListTodo size={28} style={{ color: "var(--brand)" }} />
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>All caught up!</h4>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 300, margin: "0 auto" }}>
              {searchQuery || statusFilter !== "all" ? "No tasks match your filters." : "You have no tasks assigned. Enjoy your day or create a new one!"}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal (Also given pill shape inputs) */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} title={editingTask ? "Edit task" : "Create new task"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>Task Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" className="eth-input" style={{ borderRadius: 9999, padding: "12px 20px" }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>
              Description <span style={{ opacity: 0.6 }}>(optional)</span>
            </label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add more details..." rows={3} className="eth-input" style={{ resize: "none", borderRadius: 24, padding: "16px 20px" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>Assignee</label>
              <select required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="eth-input" style={{ borderRadius: 9999, padding: "12px 20px" }}>
                <option value="">Select person</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>Project</label>
              <select required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="eth-input" style={{ borderRadius: 9999, padding: "12px 20px" }}>
                <option value="">Select project</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>Due date</label>
              <input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="eth-input" style={{ borderRadius: 9999, padding: "12px 20px" }} />
            </div>
            {editingTask && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="eth-input" style={{ borderRadius: 9999, padding: "12px 20px" }}>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 16 }}>
            <button type="button" onClick={() => { setIsModalOpen(false); setEditingTask(null); }} className="eth-btn eth-btn-secondary" style={{ flex: 1, borderRadius: 9999, padding: "12px" }}>Cancel</button>
            <button type="submit" className="eth-btn eth-btn-primary" style={{ flex: 2, borderRadius: 9999, padding: "12px", boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)" }}>{editingTask ? "Save changes" : "Create task"}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete task" size="sm">
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>Are you sure you want to delete this task? This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setDeleteConfirm(null)} className="eth-btn eth-btn-secondary" style={{ flex: 1, borderRadius: 9999 }}>Cancel</button>
          <button onClick={() => deleteTask(deleteConfirm)} className="eth-btn eth-btn-danger" style={{ flex: 1, borderRadius: 9999 }}>Delete entirely</button>
        </div>
      </Modal>

      <style>{`
        /* Hide scrollbar for the clean look but allow scrolling */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default TasksPage;
