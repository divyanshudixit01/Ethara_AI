import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => (
  <div
    style={{
      display: "flex",
      minHeight: 200,
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    }}
  >
    <Loader2
      size={24}
      strokeWidth={2}
      style={{ animation: "spin 1s linear infinite", color: "var(--brand)" }}
    />
    <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{text}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Loader;
