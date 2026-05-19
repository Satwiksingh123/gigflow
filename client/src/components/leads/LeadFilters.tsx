import { Search } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from "@/types";

export interface LeadFiltersValue {
  search: string;
  status: LeadStatus | "";
  source: LeadSource | "";
  sort: "latest" | "oldest";
}

interface Props {
  value: LeadFiltersValue;
  onChange: (next: LeadFiltersValue) => void;
}

export function LeadFilters({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search by name or email…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="block w-full rounded-lg border bg-white dark:bg-slate-900 pl-9 pr-3 h-10 text-sm border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      <Select
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as LeadStatus | "" })}
      >
        <option value="">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>

      <Select
        value={value.source}
        onChange={(e) => onChange({ ...value, source: e.target.value as LeadSource | "" })}
      >
        <option value="">All sources</option>
        {LEAD_SOURCES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>

      <Select
        value={value.sort}
        onChange={(e) => onChange({ ...value, sort: e.target.value as "latest" | "oldest" })}
      >
        <option value="latest">Latest first</option>
        <option value="oldest">Oldest first</option>
      </Select>
    </div>
  );
}