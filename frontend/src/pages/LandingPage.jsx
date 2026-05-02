import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  Users,
  BarChart3,
  Menu,
  X,
  Sparkles,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: ListTodo,
      title: "Smart Task Management",
      description: "Organize, prioritize, and track your work effortlessly with an intuitive pipeline interface.",
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description: "Work together in real-time. Assign tasks, share updates, and keep everyone aligned.",
    },
    {
      icon: LayoutDashboard,
      title: "Custom Workspaces",
      description: "Tailor your dashboard to fit your exact workflow with flexible project structures.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain deep insights into team velocity, completion rates, and upcoming bottlenecks.",
    },
  ];

  const glassStyle = {
    backgroundColor: "color-mix(in srgb, var(--bg-secondary) 70%, transparent)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
    boxShadow: "0 8px 32px -4px rgba(0,0,0,0.03)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      
      {/* GLOBAL AMBIENT BLOBS */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, var(--brand-subtle) 0%, transparent 60%)", opacity: 0.15, filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "30%", right: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, var(--info-muted) 0%, transparent 60%)", opacity: 0.1, filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, var(--brand) 0%, transparent 60%)", opacity: 0.05, filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

      {/* HEADER (Floating Glass) */}
      <header
        style={{
          position: "fixed", top: 16, left: 16, right: 16, zIndex: 50,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: isScrolled ? "color-mix(in srgb, var(--bg-secondary) 85%, transparent)" : "color-mix(in srgb, var(--bg-primary) 50%, transparent)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid color-mix(in srgb, var(--border) 40%, transparent)",
          boxShadow: isScrolled ? "0 8px 32px -4px rgba(0,0,0,0.05)" : "none",
          borderRadius: 9999,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 24px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ height: 32, width: 32, borderRadius: 10, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--brand-muted)" }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em" }}>Ethara AI</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: 32 }}>
            {["Features", "Solutions", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 16 }}>
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard" className="eth-btn eth-btn-primary" style={{ borderRadius: 9999, padding: "10px 24px" }}>
                Dashboard <ArrowRight size={16} style={{ marginLeft: 4 }} />
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", textDecoration: "none" }}>Log in</Link>
                <Link to="/register" className="eth-btn eth-btn-primary" style={{ borderRadius: 9999, padding: "10px 24px", boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)" }}>Start for free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" style={{ padding: "16px 24px", borderTop: "1px solid color-mix(in srgb, var(--border) 50%, transparent)", display: "flex", flexDirection: "column", gap: 16 }}>
            {["Features", "Solutions", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>{item}</a>
            ))}
            <div style={{ height: 1, backgroundColor: "color-mix(in srgb, var(--border) 50%, transparent)", margin: "8px 0" }} />
            {user ? (
              <Link to="/dashboard" className="eth-btn eth-btn-primary" style={{ width: "100%", justifyContent: "center", borderRadius: 9999, padding: "12px" }}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", textDecoration: "none", padding: "8px 0" }}>Log in</Link>
                <Link to="/register" className="eth-btn eth-btn-primary" style={{ width: "100%", justifyContent: "center", borderRadius: 9999, padding: "12px", boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)" }}>Start for free</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main style={{ paddingTop: 140, position: "relative", zIndex: 10 }}>
        
        {/* HERO SECTION */}
        <section style={{ padding: "64px 24px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <div className="eth-fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 9999, backgroundColor: "color-mix(in srgb, var(--brand) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--brand) 20%, transparent)", color: "var(--brand)", fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
            <Sparkles size={14} />
            <span>Introducing Ethara AI Workspace 2.0</span>
          </div>
          
          <h1 className="eth-fade-in-up" style={{ animationDelay: "0.1s", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 24, color: "var(--text-primary)" }}>
            Where <span style={{ background: "linear-gradient(to right, var(--brand), #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>high-performing</span> teams build the future.
          </h1>
          
          <p className="eth-fade-in-up" style={{ animationDelay: "0.2s", fontSize: "clamp(1.125rem, 2vw, 1.25rem)", color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6 }}>
            The all-in-one productivity suite designed for modern startups. Plan, execute, and ship products faster than ever before.
          </p>
          
          <div className="eth-fade-in-up" style={{ animationDelay: "0.3s", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            <Link to={user ? "/dashboard" : "/register"} className="eth-btn eth-btn-primary" style={{ borderRadius: 9999, padding: "16px 32px", fontSize: 16, fontWeight: 600, boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.4)", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              {user ? "Go to Dashboard" : "Start your free trial"}
            </Link>
            <a href="#features" className="eth-btn eth-btn-secondary" style={{ borderRadius: 9999, padding: "16px 32px", fontSize: 16, fontWeight: 600, ...glassStyle }}>
              Explore features
            </a>
          </div>
          
          {/* Hero Image / Dashboard Preview */}
          <div className="eth-fade-in-up" style={{ animationDelay: "0.5s", marginTop: 80, position: "relative" }}>
            <div style={{ position: "absolute", inset: -20, background: "linear-gradient(135deg, var(--brand) 0%, transparent 100%)", opacity: 0.1, filter: "blur(40px)", borderRadius: "50%" }} />
            <div 
              style={{ 
                ...glassStyle,
                border: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
                padding: "8px", 
                borderRadius: 24, 
                boxShadow: "0 24px 64px -12px rgba(0,0,0,0.15)",
                position: "relative"
              }}
            >
              <div style={{ backgroundColor: "var(--bg-primary)", borderRadius: 16, border: "1px solid color-mix(in srgb, var(--border) 40%, transparent)", aspectRatio: "16/9", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Fake App Header */}
                <div style={{ height: 48, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 16px", gap: 8, backgroundColor: "var(--bg-secondary)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ height: 10, width: 10, borderRadius: "50%", backgroundColor: "var(--clr-danger)" }} />
                    <div style={{ height: 10, width: 10, borderRadius: "50%", backgroundColor: "var(--clr-warning)" }} />
                    <div style={{ height: 10, width: 10, borderRadius: "50%", backgroundColor: "var(--clr-success)" }} />
                  </div>
                  <div style={{ margin: "0 auto", height: 24, width: 240, borderRadius: 9999, backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }} />
                </div>
                {/* Fake App Content */}
                <div style={{ flex: 1, padding: 24, display: "flex", gap: 24 }}>
                  <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ height: 20, width: "60%", borderRadius: 9999, backgroundColor: "var(--bg-tertiary)" }} />
                    <div style={{ height: 20, width: "80%", borderRadius: 9999, backgroundColor: "var(--bg-tertiary)" }} />
                    <div style={{ height: 20, width: "40%", borderRadius: 9999, backgroundColor: "var(--bg-tertiary)" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ flex: 1, height: 80, borderRadius: 16, backgroundColor: "var(--brand-muted)" }} />
                      <div style={{ flex: 1, height: 80, borderRadius: 16, backgroundColor: "var(--clr-info-bg)" }} />
                      <div style={{ flex: 1, height: 80, borderRadius: 16, backgroundColor: "var(--clr-success-bg)" }} />
                    </div>
                    <div style={{ flex: 1, borderRadius: 16, backgroundColor: "var(--bg-tertiary)", opacity: 0.5 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO CLOUD */}
        <section style={{ padding: "64px 24px", borderTop: "1px solid color-mix(in srgb, var(--border) 30%, transparent)", borderBottom: "1px solid color-mix(in srgb, var(--border) 30%, transparent)", backgroundColor: "color-mix(in srgb, var(--bg-secondary) 30%, transparent)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 32 }}>Trusted by innovative teams worldwide</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(32px, 8vw, 64px)", opacity: 0.6, filter: "grayscale(100%)" }}>
              {["Acme Corp", "GlobalTech", "Nexus", "Stark Ind", "Wayne Ent"].map((company) => (
                <div key={company} style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.05em", color: "var(--text-primary)" }}>{company}</div>
              ))}
            </div>
          </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section id="features" style={{ padding: "120px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>Everything you need to ship faster</h2>
              <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>Say goodbye to scattered tools. Ethara AI brings your tasks, docs, and team together.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {features.map((feature, idx) => (
                <div 
                  key={feature.title} 
                  className="eth-fade-in-up" 
                  style={{ 
                    ...glassStyle,
                    animationDelay: `${idx * 0.1}s`, 
                    padding: 32, 
                    borderRadius: 32,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 24px 48px -12px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "var(--brand-subtle)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 32px -4px rgba(0,0,0,0.03)";
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--border) 50%, transparent)";
                  }}
                >
                  <div style={{ height: 48, width: 48, borderRadius: "50%", backgroundColor: "var(--brand-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, color: "var(--brand)", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5)" }}>
                    <feature.icon size={24} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{feature.title}</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ padding: "120px 24px", position: "relative" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", ...glassStyle, padding: "64px 24px", borderRadius: 40, textAlign: "center", backgroundColor: "color-mix(in srgb, var(--brand-muted) 30%, transparent)", border: "1px solid color-mix(in srgb, var(--brand) 20%, transparent)", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--brand), #a855f7)" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)", opacity: 0.1, filter: "blur(60px)", zIndex: 0 }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>Ready to transform your workflow?</h2>
              <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>Join thousands of teams already using Ethara AI to do their best work.</p>
              
              <Link to="/register" className="eth-btn eth-btn-primary" style={{ borderRadius: 9999, padding: "16px 40px", fontSize: 18, fontWeight: 600, boxShadow: "0 8px 32px -4px rgba(99, 102, 241, 0.5)", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                Get started for free
              </Link>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-tertiary)" }}>No credit card required. 14-day free trial on Pro plans.</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid color-mix(in srgb, var(--border) 30%, transparent)", padding: "64px 24px", backgroundColor: "color-mix(in srgb, var(--bg-secondary) 50%, transparent)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 48 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ height: 24, width: 24, borderRadius: 8, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={12} color="#fff" />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.03em" }}>Ethara AI</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>Building the ultimate productivity OS for teams that want to move fast and stay aligned.</p>
          </div>
          
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
            {[
              { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] }
            ].map((col) => (
              <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{col.title}</h4>
                {col.links.map((link) => (
                  <a key={link} href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>{link}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "48px auto 0", paddingTop: 24, borderTop: "1px solid color-mix(in srgb, var(--border) 30%, transparent)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>© {new Date().getFullYear()} Ethara AI. All rights reserved.</p>
          <div style={{ display: "flex", gap: 16 }}>
            {["Twitter", "GitHub", "LinkedIn"].map((social) => (
              <a key={social} href="#" style={{ fontSize: 14, color: "var(--text-tertiary)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}>{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
