import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const success = await login(form);
      if (success) navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "10px 14px 10px 36px",
    fontSize: 14,
    fontFamily: "inherit",
    color: "var(--text-primary)",
    outline: "none",
  };

  const labelStyle = { fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "var(--bg-primary)" }}>
      {/* Form side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 32px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
            <div
              style={{
                height: 28, width: 28, borderRadius: 8,
                backgroundColor: "var(--brand)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>E</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Ethara AI</span>
          </Link>

          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em", marginBottom: 4 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>
            Sign in to your workspace to continue.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="login-email" style={labelStyle}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="login-email" type="email" placeholder="you@company.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} autoComplete="email" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label htmlFor="login-password" style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
                <button type="button" style={{ fontSize: 12, color: "var(--brand)", background: "none", border: "none", cursor: "pointer" }} tabIndex={-1}>Forgot password?</button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ ...inputStyle, paddingRight: 36 }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }} tabIndex={-1}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="eth-btn eth-btn-primary" style={{ width: "100%", padding: "10px 0", marginTop: 8 }}>
              {loading ? (<><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in...</>) : (<>Sign in <ArrowRight size={14} /></>)}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "var(--brand)", fontWeight: 500 }}>Create one</Link>
          </p>
        </div>
      </div>

      {/* Visual side (desktop) */}
      <div
        className="hidden lg:flex"
        style={{
          flex: 1,
          backgroundColor: "var(--brand)",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-10%", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 400, textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
            Manage your team&apos;s work in one place
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7 }}>
            Track tasks, organize projects, and collaborate with your team — all from a single, beautifully designed workspace.
          </p>
        </div>
      </div>

      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}>
        <ThemeToggle />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
