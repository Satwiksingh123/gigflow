import { cn } from "@/utils/cn";
import type { LeadStatus, LeadSource } from "@/types";

const statusStyles: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  Contacted: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Qualified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Lost: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

const sourceStyles: Record<LeadSource, string> = {
  Website: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Instagram: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
  Referral: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}>
      {status}
    </span>
  );
}

export function SourceBadge({ source }: { source: LeadSource }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", sourceStyles[source])}>
      {source}
    </span>
  );
}