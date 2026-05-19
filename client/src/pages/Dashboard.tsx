import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Sparkles, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { leadApi } from "@/services/lead.service";
import { extractError } from "@/api/axios";
import { StatusBadge } from "@/components/ui/Badge";
import type { Lead, LeadStats, LeadStatus } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: number;
  icon: typeof Users;
  colorClass: string;
  borderClass: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-7 w-16 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

interface PipelineBarProps {
  stats: LeadStats;
}

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; barClass: string; textClass: string }
> = {
  New: {
    label: "New",
    barClass: "bg-blue-500",
    textClass: "text-blue-600 dark:text-blue-400",
  },
  Contacted: {
    label: "Contacted",
    barClass: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
  },
  Qualified: {
    label: "Qualified",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
  Lost: {
    label: "Lost",
    barClass: "bg-rose-500",
    textClass: "text-rose-600 dark:text-rose-400",
  },
};

function PipelineBar({ stats }: PipelineBarProps) {
  const total = stats.total;
  if (total === 0) return null;

  const entries = (Object.entries(stats.byStatus) as [LeadStatus, number][]).filter(
    ([, count]) => count > 0,
  );

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Pipeline breakdown
      </h2>
      {/* Stacked bar */}
      <div className="flex h-3 w-full rounded-full overflow-hidden gap-px">
        {(Object.entries(stats.byStatus) as [LeadStatus, number][]).map(
          ([status, count]) =>
            count > 0 ? (
              <div
                key={status}
                className={`${STATUS_CONFIG[status].barClass} transition-all`}
                style={{ width: `${(count / total) * 100}%` }}
                title={`${status}: ${count}`}
              />
            ) : null,
        )}
      </div>
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {entries.map(([status, count]) => (
          <div key={status} className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS_CONFIG[status].barClass}`}
            />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {status}{" "}
              <span className={`font-semibold ${STATUS_CONFIG[status].textClass}`}>
                {count}
              </span>
              <span className="text-slate-400 ml-1">
                ({Math.round((count / total) * 100)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        /**
         * Previously: 5 separate API calls (1 list + 4 status filters).
         * Now: 2 calls — one stats aggregation + one for recent leads.
         * The stats endpoint does a single $group in MongoDB.
         */
        const [statsResult, recentResult] = await Promise.all([
          leadApi.stats(),
          leadApi.list({ sort: "latest", page: 1, limit: 5 }),
        ]);
        if (cancelled) return;
        setStats(statsResult);
        setRecent(recentResult.items);
      } catch (err) {
        if (!cancelled) toast.error(extractError(err, "Failed to load dashboard"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const statCards: StatCard[] = stats
    ? [
        {
          label: "Total leads",
          value: stats.total,
          icon: Users,
          colorClass: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
          borderClass: "border-l-brand-500",
        },
        {
          label: "New",
          value: stats.byStatus.New,
          icon: Sparkles,
          colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          borderClass: "border-l-blue-500",
        },
        {
          label: "Qualified",
          value: stats.byStatus.Qualified,
          icon: TrendingUp,
          colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          borderClass: "border-l-emerald-500",
        },
        {
          label: "Lost",
          value: stats.byStatus.Lost,
          icon: AlertCircle,
          colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
          borderClass: "border-l-rose-500",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          An overview of your lead pipeline.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((s) => (
              <div
                key={s.label}
                className={`card p-5 border-l-4 ${s.borderClass}`}
              >
                <div
                  className={`h-10 w-10 rounded-lg grid place-items-center ${s.colorClass}`}
                >
                  <s.icon size={20} />
                </div>
                <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {s.value}
                </p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
      </div>

      {/* ── Pipeline breakdown bar ── */}
      {!loading && stats && <PipelineBar stats={stats} />}

      {/* ── Recent leads ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent leads
          </h2>
          <Link
            to="/leads"
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-44 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No leads yet.{" "}
            <Link to="/leads" className="text-brand-600 hover:underline">
              Add your first lead →
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((lead) => (
              <li
                key={lead._id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {lead.name}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{lead.email}</p>
                </div>
                <StatusBadge status={lead.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}