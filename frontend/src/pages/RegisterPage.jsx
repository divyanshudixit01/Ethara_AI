import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
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
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: 400, height: 400, borderRadius: "50%", border: "1px solid var(--border)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 300, height: 300, borderRadius: "50%", backgroundColor: "var(--brand-muted)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 400 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
            Start managing your projects today
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
            Join teams that use Ethara AI to stay organized, meet deadlines, and build great products together.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Create projects and invite team members", "Assign tasks with deadlines and priorities", "Track progress with real-time analytics"].map((text) => (
              <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ height: 20, width: 20, borderRadius: "50%", backgroundColor: "var(--brand-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 32px" }}>
        <div style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
            <div style={{ height: 28, width: 28, borderRadius: 8, backgroundColor: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>E</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Ethara AI</span>
          </Link>

          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em", marginBottom: 4 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>Get started for free. No credit card required.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="reg-name" style={labelStyle}>Full name</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="reg-name" type="text" placeholder="Jane Smith" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} autoComplete="name" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="reg-email" style={labelStyle}>Work email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="reg-email" type="email" placeholder="jane@company.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} autoComplete="email" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="reg-password" style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ ...inputStyle, paddingRight: 36 }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }} tabIndex={-1}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, width: "100%", backgroundColor: "var(--bg-tertiary)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 999, transition: "width 0.3s", width: strength.width, backgroundColor: strength.color }} />
                  </div>
                  <p style={{ fontSize: 11, marginTop: 4, color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="eth-btn eth-btn-primary" style={{ width: "100%", padding: "10px 0", marginTop: 8 }}>
              {loading ? (<><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Creating account...</>) : (<>Create account <ArrowRight size={14} /></>)}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--brand)", fontWeight: 500 }}>Sign in</Link>
          </p>
          <p style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "var(--text-tertiary)" }}>
            By creating an account, you agree to our <a href="#" style={{ textDecoration: "underline" }}>Terms</a> and <a href="#" style={{ textDecoration: "underline" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}><ThemeToggle /></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RegisterPage;
