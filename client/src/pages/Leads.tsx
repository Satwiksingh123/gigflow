import { useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { LeadTableSkeleton } from "@/components/leads/LeadTableSkeleton";
import { LeadFilters, type LeadFiltersValue } from "@/components/leads/LeadFilters";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadForm, type LeadFormValues } from "@/components/leads/LeadForm";
import { useDebounce } from "@/hooks/useDebounce";
import { useLeads } from "@/hooks/useLeads";
import { useAuthStore } from "@/store/auth.store";
import { leadApi } from "@/services/lead.service";
import { extractError } from "@/api/axios";
import { downloadCsv, leadsToCsv } from "@/utils/csv";
import type { Lead, LeadQuery } from "@/types";
import { DEFAULT_PAGE_SIZE, CSV_EXPORT_LIMIT, DEBOUNCE_DELAY_MS } from "@/constants";

export default function LeadsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === "admin";

  // ─── Filter & pagination state ────────────────────────────────────────────
  const [filters, setFilters] = useState<LeadFiltersValue>({
    search: "",
    status: "",
    source: "",
    sort: "latest",
  });
  const [page, setPage] = useState(1);

  // Debounced search prevents an API call on every keystroke
  const debouncedSearch = useDebounce(filters.search, DEBOUNCE_DELAY_MS);

  const query: LeadQuery = useMemo(
    () => ({
      status: filters.status || undefined,
      source: filters.source || undefined,
      search: debouncedSearch || undefined,
      sort: filters.sort,
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [filters.status, filters.source, filters.sort, debouncedSearch, page],
  );

  // Reset to page 1 whenever filters change (but not on page change itself)
  const handleFiltersChange = (next: LeadFiltersValue) => {
    setFilters(next);
    setPage(1);
  };

  // ─── Data fetching (via custom hook) ─────────────────────────────────────
  const { leads, total, totalPages, loading, refresh } = useLeads(query);

  // ─── Create / Edit state ──────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };
  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(undefined);
  };

  const handleSubmit = async (values: LeadFormValues) => {
    setSubmitting(true);
    try {
      if (editing) {
        await leadApi.update(editing._id, values);
        toast.success("Lead updated");
      } else {
        await leadApi.create(values);
        toast.success("Lead created");
      }
      closeForm();
      await refresh();
    } catch (err) {
      toast.error(extractError(err, "Failed to save lead"));
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete state ─────────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await leadApi.remove(confirmDelete._id);
      toast.success("Lead deleted");
      setConfirmDelete(null);
      await refresh();
    } catch (err) {
      toast.error(extractError(err, "Failed to delete lead"));
    } finally {
      setDeleting(false);
    }
  };

  // ─── CSV Export ───────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      // Fetch all matching leads (respects current filters, bypasses pagination)
      const result = await leadApi.list({
        ...query,
        page: 1,
        limit: CSV_EXPORT_LIMIT,
      });
      const csv = leadsToCsv(result.items);
      downloadCsv(`leads-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    } catch (err) {
      toast.error(extractError(err, "Failed to export"));
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Loading…" : `${total} ${total === 1 ? "lead" : "leads"} found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={leads.length === 0 || loading}
          >
            <Download size={16} /> Export CSV
          </Button>
          <Button onClick={openCreate}>
            <Plus size={16} /> New lead
          </Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="card p-5">
        <LeadFilters value={filters} onChange={handleFiltersChange} />
      </div>

      {/* ── Table ── */}
      <div className="card">
        {loading ? (
          <LeadTableSkeleton rows={DEFAULT_PAGE_SIZE} />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads match your filters"
            description="Try adjusting your search, status, or source filters."
            action={
              <Button onClick={openCreate}>
                <Plus size={16} /> Add your first lead
              </Button>
            }
          />
        ) : (
          <>
            <LeadTable
              leads={leads}
              canDelete={isAdmin}
              onEdit={openEdit}
              onDelete={(lead) => setConfirmDelete(lead)}
            />
            <div className="px-5 pb-5">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* ── Create / Edit modal ── */}
      <Modal
        open={formOpen}
        title={editing ? "Edit lead" : "New lead"}
        onClose={closeForm}
      >
        <LeadForm
          initial={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      {/* ── Confirm delete modal ── */}
      <Modal
        open={!!confirmDelete}
        title="Delete lead?"
        onClose={() => setConfirmDelete(null)}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete{" "}
          <span className="font-medium">{confirmDelete?.name}</span>. This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
}