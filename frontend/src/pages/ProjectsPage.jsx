import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/api";
import Loader from "../components/Loader";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.success("Project created");
      setForm({ name: "", description: "", members: [] });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading) return <Loader text="Loading projects..." />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>

      <form onSubmit={createProject} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Project name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <select
          multiple
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          onChange={(e) =>
            setForm({
              ...form,
              members: Array.from(e.target.selectedOptions, (option) => option.value),
            })
          }
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
          Create Project
        </button>
      </form>

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">{project.name}</p>
                <p className="text-sm text-slate-600">{project.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Members: {project.members?.map((m) => m.name).join(", ") || "None"}
                </p>
              </div>
              <button
                onClick={() => deleteProject(project._id)}
                className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
