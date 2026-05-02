import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, FolderKanban, Users, Trash2, Box, ArrowRight, X } from "lucide-react";
import { api } from "../api/api";
import Loader from "../components/Loader";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", members: [] });

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([api.get("/projects"), api.get("/users")]);
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
      toast.success("Project created successfully");
      setForm({ name: "", description: "", members: [] });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project? All associated tasks will be affected.")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const toggleMember = (userId) => {
    setForm(prev => {
      const members = prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId];
      return { ...prev, members };
    });
  };

  if (loading) return <Loader text="Loading projects..." />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-[var(--text-secondary)]">Organize your work into high-impact projects.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
        >
          {showForm ? "Cancel" : <><Plus size={20} /> Create New Project</>}
        </button>
      </div>

      {showForm && (
        <div className="premium-card p-6 md:p-8 animate-fade-in">
          <form onSubmit={createProject} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Project Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Q3 Marketing Campaign"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Select Team Members</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]">
                {users.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => toggleMember(user._id)}
                    className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-all text-left ${
                      form.members.includes(user._id)
                        ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                        : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{user.name}</p>
                      <p className="text-[10px] opacity-70 truncate">{user.email}</p>
                    </div>
                    {form.members.includes(user._id) && <X size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
              Initialize Project
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <div 
            key={project._id} 
            className="premium-card p-8 animate-fade-in group hover:border-[var(--accent-primary)] flex flex-col h-full"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[var(--bg-primary)] text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                <Box size={28} />
              </div>
              <button
                onClick={() => deleteProject(project._id)}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">{project.name}</h4>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{project.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  <Users size={14} />
                  <span>Team Members</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.members?.map((m) => (
                    <span key={m._id} className="bg-[var(--bg-primary)] px-3 py-1 rounded-full text-xs font-semibold">
                      {m.name}
                    </span>
                  )) || <span className="text-xs italic opacity-50">No members assigned</span>}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-secondary)]">{project.members?.length || 0} Members active</span>
              <button className="flex items-center gap-1.5 text-sm font-bold text-[var(--accent-primary)] group-hover:gap-2.5 transition-all">
                Project Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {!projects.length && (
          <div className="col-span-full premium-card border-dashed p-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] mb-6">
              <FolderKanban size={40} />
            </div>
            <h4 className="text-xl font-bold">No projects initialized</h4>
            <p className="text-[var(--text-secondary)]">Start by creating a new workspace for your team.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
