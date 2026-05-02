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
    { icon: LayoutDashboard, title: "Real-time Dashboard", desc: "Track task progress, team velocity, and project health — all in one view." },
    { icon: FolderKanban, title: "Project Organization", desc: "Group tasks into projects with dedicated teams and clear ownership." },
    { icon: Users, title: "Role-based Access", desc: "Admin and member roles with fine-grained permissions for every action." },
    { icon: Shield, title: "Secure by Default", desc: "JWT auth, encrypted passwords, and input validation on every request." },
    { icon: Zap, title: "Fast & Responsive", desc: "Built with React and optimized for instant interactions on any device." },
    { icon: BarChart3, title: "Progress Analytics", desc: "Completion rates, overdue tracking, and filtering to spot bottlenecks." },
  ];

  const steps = [
    { num: "01", title: "Create your account", desc: "Sign up in seconds — no credit card needed." },
    { num: "02", title: "Set up projects", desc: "Create projects and invite your team members." },
    { num: "03", title: "Assign & track tasks", desc: "Create tasks, set deadlines, and monitor progress." },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                height: 28,
                width: 28,
                borderRadius: 8,
                backgroundColor: "var(--brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>E</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Ethara AI</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={toggleTheme}
              style={{
                height: 32,
                width: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link
              to="/login"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Log in
            </Link>
            <Link to="/register" className="eth-btn eth-btn-primary eth-btn-sm">
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: "var(--brand)",
            opacity: 0.05,
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: "80px 24px 64px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 24,
              padding: "4px 12px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-secondary)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            <span
              className="eth-pulse"
              style={{
                height: 6,
                width: 6,
                borderRadius: "50%",
                backgroundColor: "var(--clr-success)",
                display: "inline-block",
              }}
            />
            Now in public beta
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Ship faster with
            <br />
            <span style={{ color: "var(--brand)" }}>organized teamwork</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              color: "var(--text-secondary)",
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            Ethara AI helps your team manage projects, track tasks, and
            collaborate effortlessly. Simple, fast, and built for teams that care
            about getting things done.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <Link to="/register" className="eth-btn eth-btn-primary eth-btn-lg">
              Start for free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="eth-btn eth-btn-secondary eth-btn-lg">
              Sign in to your workspace
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px 24px",
              fontSize: 12,
              color: "var(--text-tertiary)",
            }}
          >
            {["No credit card required", "Free for small teams", "Set up in 2 minutes"].map(
              (t) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={13} style={{ color: "var(--clr-success)" }} />
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          className="eth-card"
          style={{ padding: 16 }}
        >
          <div
            style={{
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border)",
              padding: 20,
            }}
          >
            {/* Mock stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                { label: "Total Tasks", value: "24", color: "var(--clr-info)" },
                { label: "Completed", value: "18", color: "var(--clr-success)" },
                { label: "In Progress", value: "4", color: "var(--clr-warning)" },
                { label: "Overdue", value: "2", color: "var(--clr-danger)" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="eth-card"
                  style={{ padding: 12 }}
                >
                  <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Mock task list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { title: "Design homepage wireframes", status: "Done", done: true, clr: "var(--clr-success)", bg: "var(--clr-success-bg)" },
                { title: "Set up CI/CD pipeline", status: "In progress", done: false, clr: "var(--clr-warning)", bg: "var(--clr-warning-bg)" },
                { title: "Write API documentation", status: "To do", done: false, clr: "var(--clr-info)", bg: "var(--clr-info-bg)" },
              ].map((t) => (
                <div
                  key={t.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: "50%",
                      border: t.done ? "none" : "2px solid var(--border)",
                      backgroundColor: t.done ? "var(--clr-success)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {t.done && <CheckCircle2 size={10} color="#fff" />}
                  </div>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: t.done ? "var(--text-tertiary)" : "var(--text-primary)",
                      textDecoration: t.done ? "line-through" : "none",
                    }}
                  >
                    {t.title}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      backgroundColor: t.bg,
                      color: t.clr,
                    }}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: 12,
            }}
          >
            Everything your team needs
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>
            From task tracking to team permissions — built with care for teams
            that move fast.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {features.map((f) => (
            <div key={f.title} className="eth-card-hover" style={{ padding: 24 }}>
              <div
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--brand-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand)",
                  marginBottom: 16,
                }}
              >
                <f.icon size={20} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: 12,
            }}
          >
            Up and running in minutes
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto" }}>
            No complicated setup. Create an account, invite your team, and start
            tracking work right away.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {steps.map((s) => (
            <div key={s.num} className="eth-card" style={{ padding: 24, textAlign: "center" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--brand)",
                  opacity: 0.4,
                  marginBottom: 12,
                }}
              >
                {s.num}
              </span>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            borderRadius: "var(--radius-xl)",
            backgroundColor: "var(--brand)",
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Ready to get your team organized?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24, maxWidth: 420, margin: "0 auto 24px", fontSize: 14 }}>
            Join teams that use Ethara AI to ship better software, faster.
          </p>
          <Link
            to="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#fff",
              color: "var(--brand)",
              fontWeight: 600,
              fontSize: 14,
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
            }}
          >
            Create your free account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 0" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                height: 24,
                width: 24,
                borderRadius: 6,
                backgroundColor: "var(--brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>E</span>
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              © {new Date().getFullYear()} Ethara AI
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-tertiary)" }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
