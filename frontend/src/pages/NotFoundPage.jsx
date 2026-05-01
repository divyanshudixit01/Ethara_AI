import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center">
    <h1 className="text-4xl font-bold text-slate-900">404</h1>
    <p className="mt-2 text-slate-600">Page not found.</p>
    <Link to="/dashboard" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">
      Back to dashboard
    </Link>
  </div>
);

export default NotFoundPage;
