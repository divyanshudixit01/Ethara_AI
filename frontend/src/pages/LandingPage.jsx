import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Users,
  Shield,
  Zap,
  BarChart3,
  FolderKanban,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: LayoutDashboard,
      title: "Real-time Dashboard",
      desc: "Track task progress, team velocity, and project health — all in one view.",
    },
    {
      icon: FolderKanban,
      title: "Project Organization",
      desc: "Group tasks into projects with dedicated teams and clear ownership.",
    },
    {
      icon: Users,
      title: "Role-based Access",
      desc: "Admin and member roles with fine-grained permissions for every action.",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      desc: "JWT auth, encrypted passwords, and input validation on every request.",
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      desc: "Built with React and optimized for instant interactions on any device.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      desc: "Completion rates, overdue tracking, and filtering to spot bottlenecks.",
    },
  ];

  const steps = [
    { num: "01", title: "Create your account", desc: "Sign up in seconds — no credit card needed." },
    { num: "02", title: "Set up projects", desc: "Create projects and invite your team members." },
    { num: "03", title: "Assign & track tasks", desc: "Create tasks, set deadlines, and monitor progress." },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ====== NAV ====== */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-primary)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-sm font-semibold">Ethara AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--brand-primary)]/[0.06] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse-soft" />
            Now in public beta
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] mb-5">
            Ship faster with
            <br />
            <span className="text-[var(--brand-primary)]">organized teamwork</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
            Ethara AI helps your team manage projects, track tasks, and collaborate
            effortlessly. Simple, fast, and built for teams that care about getting
            things done.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn btn-primary btn-lg w-full sm:w-auto">
              Start for free
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg w-full sm:w-auto">
              Sign in to your workspace
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-tertiary)]">
            {["No credit card required", "Free for small teams", "Set up in 2 minutes"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--success)]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ====== DASHBOARD PREVIEW ====== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 sm:p-4 shadow-lg">
          <div className="rounded-[var(--radius-lg)] bg-[var(--bg-primary)] border border-[var(--border-primary)] p-4 sm:p-6">
            {/* Mock dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Total Tasks", value: "24", color: "var(--info)" },
                { label: "Completed", value: "18", color: "var(--success)" },
                { label: "In Progress", value: "4", color: "var(--warning)" },
                { label: "Overdue", value: "2", color: "var(--danger)" },
              ].map((s) => (
                <div key={s.label} className="card p-3">
                  <p className="text-[0.6875rem] text-[var(--text-tertiary)] mb-1">{s.label}</p>
                  <p className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {["Design homepage wireframes", "Set up CI/CD pipeline", "Write API documentation"].map((t, i) => (
                <div key={t} className="flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      i === 0
                        ? "border-[var(--success)] bg-[var(--success)]"
                        : "border-[var(--border-primary)]"
                    }`}
                  >
                    {i === 0 && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <span className={`text-sm ${i === 0 ? "line-through text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"}`}>
                    {t}
                  </span>
                  <span className={`ml-auto text-[0.6875rem] font-medium px-2 py-0.5 rounded-full ${
                    i === 0
                      ? "bg-[var(--success-muted)] text-[var(--success)]"
                      : i === 1
                        ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                        : "bg-[var(--info-muted)] text-[var(--info)]"
                  }`}>
                    {i === 0 ? "Done" : i === 1 ? "In progress" : "To do"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Everything your team needs
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
            From task tracking to team permissions — built with care for teams
            that move fast.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-interactive p-5"
            >
              <div className="h-9 w-9 rounded-[var(--radius-md)] bg-[var(--brand-muted)] flex items-center justify-center text-[var(--brand-primary)] mb-4">
                <f.icon size={18} />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-[0.8125rem] text-[var(--text-secondary)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Up and running in minutes
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            No complicated setup. Create an account, invite your team, and start
            tracking work right away.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.num} className="card p-5 text-center">
              <span className="inline-block text-2xl font-bold text-[var(--brand-primary)] mb-3 opacity-50">
                {s.num}
              </span>
              <h3 className="text-sm font-semibold mb-1.5">{s.title}</h3>
              <p className="text-[0.8125rem] text-[var(--text-secondary)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-[var(--radius-xl)] bg-[var(--brand-primary)] p-8 sm:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Ready to get your team organized?
          </h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">
            Join teams that use Ethara AI to ship better software, faster.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-[var(--brand-primary)] font-semibold text-sm px-6 py-3 rounded-[var(--radius-md)] hover:bg-white/90 transition-colors"
          >
            Create your free account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-[var(--border-primary)] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[var(--brand-primary)] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">E</span>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              © {new Date().getFullYear()} Ethara AI
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
