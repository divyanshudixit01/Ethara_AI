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
    if (!pw) return { label: "", color: "", width: "0%" };
    if (pw.length < 6) return { label: "Too short", color: "var(--danger)", width: "20%" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "var(--danger)", width: "40%" };
    if (score === 2) return { label: "Fair", color: "var(--warning)", width: "60%" };
    if (score === 3) return { label: "Good", color: "var(--info)", width: "80%" };
    return { label: "Strong", color: "var(--success)", width: "100%" };
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

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left — Visual panel (desktop only) */}
      <div className="hidden lg:flex flex-1 bg-[var(--bg-secondary)] items-center justify-center p-12 relative overflow-hidden border-r border-[var(--border-primary)]">
        <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full border border-[var(--border-primary)]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[var(--brand-muted)]" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            Start managing your projects today
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
            Join teams that use Ethara AI to stay organized, meet deadlines, and
            build great products together.
          </p>
          <div className="space-y-3">
            {[
              "Create projects and invite team members",
              "Assign tasks with deadlines and priorities",
              "Track progress with real-time analytics",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-[var(--brand-muted)] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="h-7 w-7 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-sm font-semibold">Ethara AI</span>
          </Link>

          <h1 className="text-xl font-semibold tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            Get started for free. No credit card required.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="text-[0.8125rem] font-medium">
                Full name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Jane Smith"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-base pl-9"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-[0.8125rem] font-medium">
                Work email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="jane@company.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-base pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="text-[0.8125rem] font-medium">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-base pl-9 pr-9"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength */}
              {form.password && (
                <div className="space-y-1">
                  <div className="h-1 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <p className="text-[0.6875rem]" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--brand-primary)] font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-[0.6875rem] text-[var(--text-tertiary)]">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline">Terms</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default RegisterPage;
