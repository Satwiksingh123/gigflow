import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  /** Whether the mobile drawer is open */
  open?: boolean;
  /** Called when the mobile drawer should close */
  onClose?: () => void;
}

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users, end: false },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="px-3 py-2 space-y-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            )
          }
        >
          <Icon size={18} /> {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Logo() {
  return (
    <div className="px-6 py-5 flex items-center gap-2">
      <div className="h-9 w-9 rounded-lg bg-brand-600 grid place-items-center text-white shrink-0">
        <Sparkles size={18} />
      </div>
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
          GigFlow
        </p>
        <p className="text-xs text-slate-500">Smart Leads</p>
      </div>
    </div>
  );
}

/** Desktop sidebar — always visible on lg+ */
export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <Logo />
      <NavLinks />
    </aside>
  );
}

/**
 * Mobile sidebar drawer — slides in from the left.
 * Controlled by the parent (Topbar triggers open/close).
 */
export function MobileSidebar({ open = false, onClose }: Props) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:hidden">
        <Logo />
        <NavLinks onClose={onClose} />
      </aside>
    </>
  );
}