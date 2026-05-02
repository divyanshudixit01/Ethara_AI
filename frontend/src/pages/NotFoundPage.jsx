import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6 text-center">
    <div className="animate-fade-in-up max-w-md">
      <p className="text-6xl font-bold text-[var(--text-tertiary)] mb-2 tracking-tighter">
        404
      </p>
      <h1 className="text-xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
