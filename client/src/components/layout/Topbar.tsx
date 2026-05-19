import { useState } from "react";
import { LogOut, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import { useDarkMode } from "@/hooks/useDarkMode";
import { MobileSidebar } from "@/components/layout/Sidebar";

export function Topbar() {
  const { user, logout } = useAuthStore();
  const [dark, toggle] = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <header className="h-16 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 sticky top-0 z-30">
        {/* Left: hamburger on mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          {/* Brand name — visible on mobile when sidebar is hidden */}
          <span className="lg:hidden font-semibold text-slate-900 dark:text-slate-100">
            GigFlow
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {user && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          )}

          {/* Avatar — purely decorative, shows initials */}
          <div
            className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 grid place-items-center font-semibold text-sm select-none shrink-0"
            aria-hidden="true"
          >
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>

          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </header>
    </>
  );
}