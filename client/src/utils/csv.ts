import type { Lead } from "@/types";

function escapeCell(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function leadsToCsv(leads: Lead[]): string {
  const header = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = leads.map((l) => [l.name, l.email, l.status, l.source, l.createdAt]);
  return [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}