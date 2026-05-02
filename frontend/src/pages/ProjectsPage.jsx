import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, FolderKanban, Users, Trash2, Box, ArrowRight, X, Search, MoreHorizontal } from "lucide-react";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { CardSkeleton } from "../components/Skeleton";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      toast.success("Project initialized successfully");
      setForm({ name: "", description: "", members: [] });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("CRITICAL ACTION: Are you sure you want to delete this project? This will archive all related data.")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project permanently removed");
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

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Hub</h2>
          <p className="text-[var(--text-secondary)] font-medium">Strategic workspaces for high-impact team initiatives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-8 py-4 font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Initialize Workspace
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
        <input
          type="text"
          placeholder="Filter workspaces by name or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all font-medium"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <div 
            key={project._id} 
            className="premium-card p-10 animate-fade-in group hover:border-[var(--accent-primary)] flex flex-col h-full relative"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-8">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-indigo-50 text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all shadow-inner dark:bg-indigo-900/20">
                <Box size={32} />
              </div>
              <div className="flex gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-all">
                  <MoreHorizontal size={20} />
                </button>
                <button
                  onClick={() => deleteProject(project._id)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                 <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Active Workspace</span>
              </div>
              <h4 className="text-2xl font-black mb-3 group-hover:text-[var(--accent-primary)] transition-colors tracking-tight">{project.name}</h4>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-8 font-medium line-clamp-3">{project.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.1em] opacity-60">
                  <Users size={14} />
                  <span>Deployment Team</span>
                </div>
                <div className="flex -space-x-3 overflow-hidden">
                  {project.members?.map((m, i) => (
                    <div 
                      key={m._id} 
                      className="h-10 w-10 rounded-full border-4 border-[var(--bg-secondary)] bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 ring-2 ring-indigo-500/20"
                      title={m.name}
                      style={{ zIndex: 10 - i }}
                    >
                      {m.name.charAt(0)}
                    </div>
                  )) || <span className="text-xs italic opacity-50">Zero active members</span>}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--border-color)] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Velocity</span>
                <span className="text-lg font-black text-[var(--accent-primary)]">{project.members?.length || 0} Operators</span>
              </div>
              <button className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-all px-4 py-2 rounded-xl hover:bg-[var(--bg-primary)]">
                Launch Space <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}

        {!filteredProjects.length && (
          <div className="col-span-full premium-card border-dashed p-24 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] mb-6">
              <FolderKanban size={48} />
            </div>
            <h4 className="text-2xl font-bold mb-2">No workspaces deployed</h4>
            <p className="text-[var(--text-secondary)] font-medium">Initialize your first project to begin team collaboration.</p>
          </div>
        )}
      </div>

      {/* Project Creation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Initialize Strategic Workspace"
      >
        <form onSubmit={createProject} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Workspace Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. NextGen AI Platform"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Executive Summary</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Define the core objectives and vision of this project..."
              rows={4}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all resize-none font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold ml-1">Assemble Development Team</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] scrollbar-thin">
              {users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => toggleMember(user._id)}
                  className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all text-left group ${
                    form.members.includes(user._id)
                      ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-lg shadow-indigo-500/20"
                      : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
                  }`}
                >
                  <div className="truncate">
                    <p className="text-xs font-black truncate">{user.name}</p>
                    <p className="text-[10px] opacity-70 truncate font-bold">{user.email}</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${
                    form.members.includes(user._id) ? "bg-white/20" : "bg-[var(--bg-primary)]"
                  }`}>
                    {form.members.includes(user._id) ? <X size={14} /> : <Plus size={14} />}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-60 ml-1 italic">* Select members to grant workspace access permissions.</p>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
            >
              Cancel Setup
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-slate-900 dark:bg-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
            >
              Initialize Workspace
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
