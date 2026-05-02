import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => (
  <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] animate-fade-in">
    <div className="relative mb-4">
      <div className="h-12 w-12 rounded-full border-4 border-[var(--accent-primary)]/20"></div>
      <Loader2 className="absolute top-0 left-0 h-12 w-12 animate-spin text-[var(--accent-primary)]" />
    </div>
    <p className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)]">{text}</p>
  </div>
);

export default Loader;
