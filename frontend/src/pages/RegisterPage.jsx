import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const passwordStrength = (pw) => {
    if (!pw) return { label: "", color: "transparent", width: "0%" };
    if (pw.length < 6) return { label: "Too short", color: "var(--clr-danger)", width: "20%" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "var(--clr-danger)", width: "40%" };
    if (score === 2) return { label: "Fair", color: "var(--clr-warning)", width: "60%" };
    if (score === 3) return { label: "Good", color: "var(--clr-info)", width: "80%" };
    return { label: "Strong", color: "var(--clr-success)", width: "100%" };
  };
  const strength = passwordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return;
    try {
      setLoading(true);
      const success = await register(form);
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
      {/* Visual side */}
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
          borderRight: "1px solid var(--border)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 0%, var(--brand-subtle) 100%)", opacity: 0.1 }} />
        
        {/* Abstract shapes */}
        <div style={{ position: "absolute", top: "15%", left: "15%", width: 250, height: 250, borderRadius: "50%", background: "var(--brand-muted)", backdropFilter: "blur(40px)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.1)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "15%", width: 350, height: 350, borderRadius: 80, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)", transform: "rotate(-15deg)", boxShadow: "0 24px 64px rgba(99,102,241,0.3)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 440, backgroundColor: "color-mix(in srgb, var(--bg-secondary) 60%, transparent)", backdropFilter: "blur(24px)", padding: 48, borderRadius: 40, border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", boxShadow: "0 24px 64px -12px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Start managing your projects today
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            Join teams that use Ethara AI to stay organized, meet deadlines, and build great products together.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["Create projects and invite team members", "Assign tasks with deadlines and priorities", "Track progress with real-time analytics"].map((text) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ height: 24, width: 24, borderRadius: "50%", backgroundColor: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(99,102,241,0.4)" }}>
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 32px", position: "relative", zIndex: 10 }}>
        {/* Background blobs for form side */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, var(--info-muted) 0%, transparent 60%)", opacity: 0.2, filter: "blur(100px)", pointerEvents: "none" }} />
        
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
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ height: 32, width: 32, borderRadius: 10, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--brand-muted)" }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em" }}>Ethara AI</span>
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32 }}>Get started for free. No credit card required.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label htmlFor="reg-name" style={labelStyle}>Full name</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="reg-name" type="text" placeholder="Jane Smith" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} autoComplete="name" />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" style={labelStyle}>Work email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="reg-email" type="email" placeholder="jane@company.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} autoComplete="email" />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ ...inputStyle, paddingRight: 44 }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }} tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8, paddingLeft: 8, paddingRight: 8 }}>
                  <div style={{ height: 4, width: "100%", backgroundColor: "var(--bg-tertiary)", borderRadius: 9999, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 9999, transition: "width 0.3s, background-color 0.3s", width: strength.width, backgroundColor: strength.color }} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, marginTop: 6, color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="eth-btn eth-btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 9999, marginTop: 12, fontSize: 15, fontWeight: 600, boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.4)" }}>
              {loading ? (<><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Creating account...</>) : (<>Create workspace account <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>

      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 50 }}><ThemeToggle /></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RegisterPage;
