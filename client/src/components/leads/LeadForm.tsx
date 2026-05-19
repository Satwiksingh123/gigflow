import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@/types";

/**
 * Derive Zod enums directly from the authoritative const arrays in @/types.
 * This guarantees LeadForm stays in sync with the type system automatically —
 * no duplicated literal strings that can silently diverge.
 */
const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Invalid email"),
  status: z.enum([...LEAD_STATUSES] as [LeadStatus, ...LeadStatus[]]),
  source: z.enum([...LEAD_SOURCES] as [LeadSource, ...LeadSource[]]),
  notes: z.string().trim().max(500).optional(),
});

export type LeadFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Lead;
  submitting?: boolean;
  onSubmit: (values: LeadFormValues) => void;
  onCancel: () => void;
}

export function LeadForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      email: initial?.email ?? "",
      status: initial?.status ?? "New",
      source: initial?.source ?? "Website",
      notes: initial?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Jane Doe"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        placeholder="jane@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Status" {...register("status")} error={errors.status?.message}>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select label="Source" {...register("source")} error={errors.source?.message}>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Notes <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Add context about this lead…"
          className="block w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Save changes" : "Create lead"}
        </Button>
      </div>
    </form>
  );
}