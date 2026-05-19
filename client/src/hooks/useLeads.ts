import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { leadApi } from "@/services/lead.service";
import { extractError } from "@/api/axios";
import type { Lead, LeadQuery } from "@/types";

interface UseLeadsResult {
  leads: Lead[];
  total: number;
  totalPages: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Encapsulates all data-fetching logic for the leads list.
 * The Leads page becomes pure UI — it calls this hook and renders what it gets.
 *
 * Cancellation: uses an `active` flag to prevent state updates on unmounted
 * components, which would cause React warnings and potential memory leaks.
 */
export function useLeads(query: LeadQuery): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(
    async (signal?: { cancelled: boolean }) => {
      setLoading(true);
      try {
        const result = await leadApi.list(query);
        if (signal?.cancelled) return;
        setLeads(result.items);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (signal?.cancelled) return;
        toast.error(extractError(err, "Failed to load leads"));
      } finally {
        if (!signal?.cancelled) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(query)],
  );

  useEffect(() => {
    const signal = { cancelled: false };
    fetchLeads(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [fetchLeads]);

  /**
   * Manually re-fetch after a mutation (create/update/delete).
   * Has its own error handling so callers don't need to wrap it.
   */
  const refresh = useCallback(async () => {
    try {
      const result = await leadApi.list(query);
      setLeads(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      toast.error(extractError(err, "Failed to refresh leads"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  return { leads, total, totalPages, loading, refresh };
}
