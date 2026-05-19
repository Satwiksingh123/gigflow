import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, id, children, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "block w-full rounded-lg border bg-white dark:bg-slate-900 px-3 h-10 text-sm",
          "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          error && "border-red-500 focus:ring-red-500",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});