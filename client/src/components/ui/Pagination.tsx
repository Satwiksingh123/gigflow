import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page <span className="font-medium text-slate-700 dark:text-slate-200">{page}</span> of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={16} /> Prev
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}