import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)", padding: 24, textAlign: "center" }}>
    <div className="eth-fade-in-up" style={{ maxWidth: 400 }}>
      <p style={{ fontSize: 72, fontWeight: 700, color: "var(--text-tertiary)", marginBottom: 8, letterSpacing: "-0.05em", lineHeight: 1 }}>
        404
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>Page not found</h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="eth-btn eth-btn-primary">
        <ArrowLeft size={16} /> Back to home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
