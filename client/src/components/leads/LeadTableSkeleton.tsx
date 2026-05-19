/**
 * Skeleton loading state for the leads table.
 * Uses animated shimmer placeholders that match the table's column layout,
 * so the page doesn't visually "jump" when real data loads in.
 */
export function LeadTableSkeleton({ rows = 8 }: { rows?: number }) {
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
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-3 px-4">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="py-3 px-4">
                <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="py-3 px-4">
                <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
