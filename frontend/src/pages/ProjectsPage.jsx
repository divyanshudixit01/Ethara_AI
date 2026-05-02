import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  FolderKanban,
  Users,
  Trash2,
  Search,
  CheckCircle2,
  Sparkles
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
      setUsers(usersRes.data);
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
      toast.success("Project created beautifully");
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
      toast.success("Project removed");
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

  const glassStyle = {
    backgroundColor: "color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
    boxShadow: "0 8px 32px -4px rgba(0,0,0,0.03)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div className="eth-skeleton" style={{ height: 28, width: 128, borderRadius: 9999 }} />
          <div className="eth-skeleton" style={{ height: 16, width: 224, borderRadius: 9999 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Header */}
      <div className="eth-fade-in-up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, paddingLeft: 8 }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={24} style={{ color: "var(--brand)" }} />
            Team Projects
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 6 }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} in the workspace.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="eth-btn eth-btn-primary eth-scale-in"
          style={{ borderRadius: 9999, padding: "10px 20px", boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)" }}
        >
          <Plus size={16} /> New project
        </button>
      </div>

      {/* Search (Glass Pill) */}
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
            placeholder="Search projects..." 
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
      </div>

      {/* Projects Grid */}
      <div className="eth-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {filteredProjects.map((project) => (
          <div 
            key={project._id} 
            style={{ ...glassStyle, padding: 24, borderRadius: 32, position: "relative" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px -8px rgba(0,0,0,0.06)";
              e.currentTarget.style.borderColor = "var(--brand-subtle)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px -4px rgba(0,0,0,0.03)";
              e.currentTarget.style.borderColor = "color-mix(in srgb, var(--border) 50%, transparent)";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ height: 48, width: 48, borderRadius: "50%", backgroundColor: "var(--brand-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5)" }}>
                <FolderKanban size={20} />
              </div>
              <button
                onClick={() => setDeleteConfirm(project._id)}
                style={{ height: 36, width: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", color: "var(--text-tertiary)", background: "color-mix(in srgb, var(--bg-tertiary) 50%, transparent)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--clr-danger)"; e.currentTarget.style.backgroundColor = "var(--clr-danger-bg)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--bg-tertiary) 50%, transparent)"; e.currentTarget.style.transform = "scale(1)"; }}
                title="Delete project"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{project.name}</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {project.description || "No description provided."}
            </p>

            {/* Members area */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", backgroundColor: "var(--bg-primary)", borderRadius: 9999 }}>
                <Users size={14} style={{ color: "var(--brand)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {project.members?.length || 0} Member{(project.members?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              {project.members && project.members.length > 0 && (
                <div style={{ display: "flex", marginLeft: -8 }}>
                  {project.members.slice(0, 4).map((m) => (
                    <div
                      key={m._id}
                      style={{ height: 28, width: 28, borderRadius: "50%", backgroundColor: "var(--brand-muted)", border: "2px solid var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--brand)", marginLeft: -8, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                      title={m.name}
                    >
                      {m.name?.charAt(0)?.toUpperCase()}
                    </div>
                  ))}
                  {project.members.length > 4 && (
                    <div style={{ height: 28, width: 28, borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", border: "2px solid var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--text-secondary)", marginLeft: -8, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="eth-scale-in" style={{ gridColumn: "1 / -1", padding: 64, textAlign: "center", backgroundColor: "color-mix(in srgb, var(--bg-secondary) 50%, transparent)", backdropFilter: "blur(10px)", border: "1px dashed var(--border)", borderRadius: 40 }}>
            <div style={{ height: 64, width: 64, borderRadius: "50%", backgroundColor: "var(--brand-muted)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FolderKanban size={28} style={{ color: "var(--brand)" }} />
            </div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No projects found</h4>
            <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
              {searchQuery ? "Try a different search term." : "Create your first project to get your team moving."}
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={createProject} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>Project Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mobile App Redesign" className="eth-input" style={{ borderRadius: 9999, padding: "12px 20px" }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>
              Description <span style={{ opacity: 0.6 }}>(optional)</span>
            </label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" rows={3} className="eth-input" style={{ resize: "none", borderRadius: 24, padding: "16px 20px" }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8, color: "var(--text-secondary)" }}>Invite Team Members</label>
            <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, padding: 12, border: "1px solid var(--border)", borderRadius: 24, backgroundColor: "var(--bg-primary)" }}>
              {users.length > 0 ? (
                users.map((u) => {
                  const selected = form.members.includes(u._id);
                  return (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => toggleMember(u._id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px", borderRadius: 9999, border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.2s", backgroundColor: selected ? "var(--brand-muted)" : "transparent" }}
                      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <div style={{ height: 24, width: 24, borderRadius: "50%", border: "2px solid", borderColor: selected ? "var(--brand)" : "var(--border)", backgroundColor: selected ? "var(--brand)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                        {selected && <CheckCircle2 size={14} color="#fff" />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: selected ? "var(--brand)" : "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                        <p style={{ fontSize: 12, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p style={{ fontSize: 14, color: "var(--text-tertiary)", padding: 16, textAlign: "center" }}>No team members available</p>
              )}
            </div>
            {form.members.length > 0 && <p style={{ fontSize: 12, fontWeight: 500, color: "var(--brand)", marginTop: 8, paddingLeft: 8 }}>{form.members.length} members selected</p>}
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 12 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="eth-btn eth-btn-secondary" style={{ flex: 1, borderRadius: 9999, padding: "12px" }}>Cancel</button>
            <button type="submit" className="eth-btn eth-btn-primary" style={{ flex: 2, borderRadius: 9999, padding: "12px", boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)" }}>Launch Project</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete project" size="sm">
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>Are you absolutely sure? This will permanently delete this project and wipe all tasks associated with it. This cannot be undone.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setDeleteConfirm(null)} className="eth-btn eth-btn-secondary" style={{ flex: 1, borderRadius: 9999, padding: "12px" }}>Cancel</button>
          <button onClick={() => deleteProject(deleteConfirm)} className="eth-btn eth-btn-danger" style={{ flex: 1, borderRadius: 9999, padding: "12px" }}>Delete entirely</button>
        </div>
      </Modal>

      <style>{`
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
