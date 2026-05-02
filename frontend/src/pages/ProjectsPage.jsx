import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  FolderKanban,
  Users,
  Trash2,
  Search,
  CheckCircle2,
} from "lucide-react";
import { api } from "../api/api";
import Modal from "../components/Modal";
import { CardSkeleton } from "../components/Skeleton";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", members: [] });

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get("/projects"),
        api.get("/users"),
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data.filter((u) => u.role === "member"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", form);
      toast.success("Project created");
      setForm({ name: "", description: "", members: [] });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const toggleMember = (userId) => {
    setForm((prev) => {
      const members = prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId];
      return { ...prev, members };
    });
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [projects, searchQuery]
  );

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
          <h1 style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)", fontWeight: 600, letterSpacing: "-0.025em" }}>Projects</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="eth-btn eth-btn-primary">
          <Plus size={16} /> New project
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
        <input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="eth-input" style={{ paddingLeft: 36 }} />
      </div>

      {/* Projects Grid */}
      <div className="eth-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {filteredProjects.map((project) => (
          <div key={project._id} className="eth-card-hover" style={{ padding: 20, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ height: 36, width: 36, borderRadius: "var(--radius-md)", backgroundColor: "var(--brand-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}>
                <FolderKanban size={18} />
              </div>
              <button
                onClick={() => setDeleteConfirm(project._id)}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", color: "var(--text-tertiary)", background: "transparent", border: "none", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--clr-danger)"; e.currentTarget.style.backgroundColor = "var(--clr-danger-bg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                title="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{project.name}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {project.description || "No description provided."}
            </p>

            {/* Members */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={13} style={{ color: "var(--text-tertiary)" }} />
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                  {project.members?.length || 0} member{(project.members?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              {project.members && project.members.length > 0 && (
                <div style={{ display: "flex", marginLeft: -6 }}>
                  {project.members.slice(0, 4).map((m) => (
                    <div
                      key={m._id}
                      style={{ height: 24, width: 24, borderRadius: "50%", backgroundColor: "var(--brand-muted)", border: "2px solid var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: "var(--brand)", marginLeft: -6 }}
                      title={m.name}
                    >
                      {m.name?.charAt(0)?.toUpperCase()}
                    </div>
                  ))}
                  {project.members.length > 4 && (
                    <div style={{ height: 24, width: 24, borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", border: "2px solid var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 500, color: "var(--text-secondary)", marginLeft: -6 }}>
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="eth-card" style={{ gridColumn: "1 / -1", padding: 48, textAlign: "center" }}>
            <FolderKanban size={36} style={{ margin: "0 auto 12px", color: "var(--text-tertiary)" }} />
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No projects found</h4>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {searchQuery ? "Try a different search term." : "Create your first project to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New project">
        <form onSubmit={createProject} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Project name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mobile App Redesign" className="eth-input" />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Description <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" rows={3} className="eth-input" style={{ resize: "none" }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Team members</label>
            <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, padding: 8, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-primary)" }}>
              {users.length > 0 ? (
                users.map((u) => {
                  const selected = form.members.includes(u._id);
                  return (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => toggleMember(u._id)}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: 8, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", textAlign: "left", transition: "background-color 0.15s", backgroundColor: selected ? "var(--brand-muted)" : "transparent" }}
                      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <div style={{ height: 20, width: 20, borderRadius: 6, border: "1px solid", borderColor: selected ? "var(--brand)" : "var(--border)", backgroundColor: selected ? "var(--brand)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                        {selected && <CheckCircle2 size={12} color="#fff" />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p style={{ fontSize: 13, color: "var(--text-tertiary)", padding: 8, textAlign: "center" }}>No team members available</p>
              )}
            </div>
            {form.members.length > 0 && <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>{form.members.length} selected</p>}
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="eth-btn eth-btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="eth-btn eth-btn-primary" style={{ flex: 2 }}>Create project</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete project" size="sm">
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>Are you sure? This will permanently delete this project and cannot be undone.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setDeleteConfirm(null)} className="eth-btn eth-btn-secondary" style={{ flex: 1 }}>Cancel</button>
          <button onClick={() => deleteProject(deleteConfirm)} className="eth-btn eth-btn-danger" style={{ flex: 1 }}>Delete project</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
