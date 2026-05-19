import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-900 dark:text-slate-100">404</p>
        <p className="mt-2 text-slate-500">Page not found</p>
        <Link to="/" className="mt-6 inline-block text-brand-600 hover:underline">Go home</Link>
      </div>
    </div>
  );
}