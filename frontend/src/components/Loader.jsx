import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => (
  <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3">
    <Loader2
      className="h-6 w-6 animate-spin text-[var(--brand-primary)]"
      strokeWidth={2}
    />
    <p className="text-sm text-[var(--text-secondary)]">{text}</p>
  </div>
);

export default Loader;
