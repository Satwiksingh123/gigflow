import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge, SourceBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Lead } from "@/types";

interface Props {
  leads: Lead[];
  canDelete: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LeadTable({ leads, canDelete, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <th className="py-3 px-4 font-medium">Name</th>
            <th className="py-3 px-4 font-medium">Email</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Source</th>
            <th className="py-3 px-4 font-medium">Created</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">{lead.name}</td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{lead.email}</td>
              <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
              <td className="py-3 px-4"><SourceBadge source={lead.source} /></td>
              <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{formatDate(lead.createdAt)}</td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(lead)} aria-label="Edit">
                    <Pencil size={16} />
                  </Button>
                  {canDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(lead)} aria-label="Delete">
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}