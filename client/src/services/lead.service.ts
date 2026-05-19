import { api } from "@/api/axios";
import type { ApiEnvelope, Lead, LeadQuery, LeadStats, Paginated } from "@/types";

export interface LeadInput {
  name: string;
  email: string;
  status?: Lead["status"];
  source: Lead["source"];
  notes?: string;
}

export const leadApi = {
  async list(query: LeadQuery): Promise<Paginated<Lead>> {
    const { data } = await api.get<ApiEnvelope<Paginated<Lead>>>("/leads", {
      params: query,
    });
    return data.data;
  },

  async getById(id: string): Promise<Lead> {
    const { data } = await api.get<ApiEnvelope<Lead>>(`/leads/${id}`);
    return data.data;
  },

  async create(input: LeadInput): Promise<Lead> {
    const { data } = await api.post<ApiEnvelope<Lead>>("/leads", input);
    return data.data;
  },

  async update(id: string, input: Partial<LeadInput>): Promise<Lead> {
    const { data } = await api.patch<ApiEnvelope<Lead>>(`/leads/${id}`, input);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/leads/${id}`);
  },

  /**
   * Fetch aggregated lead counts from the backend in a single request.
   * Used by the dashboard to replace the previous N=5 parallel API calls.
   */
  async stats(): Promise<LeadStats> {
    const { data } = await api.get<ApiEnvelope<LeadStats>>("/leads/stats");
    return data.data;
  },
};