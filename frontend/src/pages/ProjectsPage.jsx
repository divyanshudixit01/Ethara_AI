import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  FolderKanban,
  Users,
  Trash2,
  Search,
  MoreHorizontal,
  X,
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

  useEffect(() => {
    fetchData();
  }, []);

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
            Projects
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          New project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-base pl-9"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {filteredProjects.map((project) => (
          <div key={project._id} className="card-interactive p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-[var(--radius-md)] bg-[var(--brand-muted)] flex items-center justify-center text-[var(--brand-primary)]">
                <FolderKanban size={18} />
              </div>
              <button
                onClick={() => setDeleteConfirm(project._id)}
                className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:bg-[var(--danger-muted)] opacity-0 group-hover:opacity-100 transition-all"
                title="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <h3 className="text-sm font-semibold mb-1">{project.name}</h3>
            <p className="text-[0.8125rem] text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
              {project.description || "No description provided."}
            </p>

            {/* Members */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
              <div className="flex items-center gap-2">
                <Users
                  size={13}
                  className="text-[var(--text-tertiary)]"
                />
                <span className="text-[0.6875rem] text-[var(--text-secondary)]">
                  {project.members?.length || 0} member
                  {(project.members?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              {project.members && project.members.length > 0 && (
                <div className="flex -space-x-1.5">
                  {project.members.slice(0, 4).map((m) => (
                    <div
                      key={m._id}
                      className="h-6 w-6 rounded-full bg-[var(--brand-muted)] border-2 border-[var(--card-bg)] flex items-center justify-center text-[9px] font-semibold text-[var(--brand-primary)]"
                      title={m.name}
                    >
                      {m.name?.charAt(0)?.toUpperCase()}
                    </div>
                  ))}
                  {project.members.length > 4 && (
                    <div className="h-6 w-6 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--card-bg)] flex items-center justify-center text-[9px] font-medium text-[var(--text-secondary)]">
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full card p-12 text-center">
            <FolderKanban
              size={36}
              className="mx-auto mb-3 text-[var(--text-tertiary)]"
            />
            <h4 className="text-sm font-semibold mb-1">No projects found</h4>
            <p className="text-[0.8125rem] text-[var(--text-secondary)]">
              {searchQuery
                ? "Try a different search term."
                : "Create your first project to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New project"
      >
        <form onSubmit={createProject} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium">
              Project name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Mobile App Redesign"
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
              placeholder="What is this project about?"
              rows={3}
              className="input-base resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8125rem] font-medium">
              Team members
            </label>
            <div className="max-h-[200px] overflow-y-auto space-y-1 p-2 border border-[var(--border-primary)] rounded-[var(--radius-md)] bg-[var(--bg-primary)]">
              {users.length > 0 ? (
                users.map((u) => {
                  const selected = form.members.includes(u._id);
                  return (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => toggleMember(u._id)}
                      className={`flex items-center gap-2.5 w-full p-2 rounded-[var(--radius-sm)] text-left transition-colors ${
                        selected
                          ? "bg-[var(--brand-muted)]"
                          : "hover:bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                          selected
                            ? "bg-[var(--brand-primary)] border-[var(--brand-primary)]"
                            : "border-[var(--border-primary)]"
                        }`}
                      >
                        {selected && (
                          <CheckCircle2 size={12} className="text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.8125rem] font-medium truncate">
                          {u.name}
                        </p>
                        <p className="text-[0.6875rem] text-[var(--text-tertiary)] truncate">
                          {u.email}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-[0.8125rem] text-[var(--text-tertiary)] p-2 text-center">
                  No team members available
                </p>
              )}
            </div>
            {form.members.length > 0 && (
              <p className="text-[0.6875rem] text-[var(--text-secondary)]">
                {form.members.length} selected
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-[2]">
              Create project
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete project"
        size="sm"
      >
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Are you sure? This will permanently delete this project and cannot be
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
            onClick={() => deleteProject(deleteConfirm)}
            className="btn btn-danger flex-1"
          >
            Delete project
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
