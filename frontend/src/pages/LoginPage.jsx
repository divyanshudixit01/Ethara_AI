import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from "lucide-react";
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
    backgroundColor: "color-mix(in srgb, var(--bg-primary) 50%, transparent)",
    border: "1px solid color-mix(in srgb, var(--border) 80%, transparent)",
    borderRadius: 9999,
    padding: "14px 20px 14px 44px",
    fontSize: 14,
    fontFamily: "inherit",
    color: "var(--text-primary)",
    outline: "none",
    transition: "all 0.2s"
  };

  const labelStyle = { fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8, color: "var(--text-secondary)", paddingLeft: 8 };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, var(--brand-subtle) 0%, transparent 60%)", opacity: 0.2, filter: "blur(100px)", pointerEvents: "none" }} />
      
      {/* Form side */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 32px", zIndex: 10 }}>
        <div 
          className="eth-fade-in-up"
          style={{ 
            width: "100%", maxWidth: 420, margin: "0 auto", 
            backgroundColor: "color-mix(in srgb, var(--bg-secondary) 70%, transparent)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
            borderRadius: 40, padding: 48,
            boxShadow: "0 24px 64px -12px rgba(0,0,0,0.08)"
          }}
        >
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ height: 32, width: 32, borderRadius: 10, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--brand-muted)" }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em" }}>Ethara AI</span>
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 40 }}>
            Sign in to your workspace to continue.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label htmlFor="login-email" style={labelStyle}>Work email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="login-email" type="email" placeholder="you@company.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} autoComplete="email" />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingLeft: 8, paddingRight: 8 }}>
                <label htmlFor="login-password" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
                <button type="button" style={{ fontSize: 12, fontWeight: 600, color: "var(--brand)", background: "none", border: "none", cursor: "pointer" }} tabIndex={-1}>Forgot?</button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ ...inputStyle, paddingRight: 44 }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }} tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="eth-btn eth-btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 9999, marginTop: 12, fontSize: 15, fontWeight: 600, boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.4)" }}>
              {loading ? (<><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Authenticating...</>) : (<>Sign in to workspace <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>

      {/* Visual side (desktop) */}
      <div
        className="hidden lg:flex"
        style={{
          flex: 1,
          backgroundColor: "var(--bg-secondary)",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
          borderLeft: "1px solid var(--border)"
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--brand-subtle) 0%, transparent 100%)", opacity: 0.1 }} />
        
        {/* Abstract 3D-like shapes */}
        <div style={{ position: "absolute", top: "20%", right: "20%", width: 300, height: 300, borderRadius: 60, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)", transform: "rotate(45deg)", boxShadow: "0 24px 64px rgba(99,102,241,0.3)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "20%", width: 200, height: 200, borderRadius: "50%", background: "var(--bg-primary)", backdropFilter: "blur(40px)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.1)" }} />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: 440, backgroundColor: "color-mix(in srgb, var(--bg-secondary) 60%, transparent)", backdropFilter: "blur(24px)", padding: 48, borderRadius: 40, border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", boxShadow: "0 24px 64px -12px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <div style={{ height: 12, width: 12, borderRadius: "50%", backgroundColor: "var(--clr-danger)" }} />
            <div style={{ height: 12, width: 12, borderRadius: "50%", backgroundColor: "var(--clr-warning)" }} />
            <div style={{ height: 12, width: 12, borderRadius: "50%", backgroundColor: "var(--clr-success)" }} />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Ship faster with organized teamwork
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6 }}>
            Track tasks, organize projects, and collaborate with your team — all from a single, beautifully designed workspace.
          </p>
        </div>
      </div>

      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 50 }}>
        <ThemeToggle />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
