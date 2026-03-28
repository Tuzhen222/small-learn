import { Payment, PaymentListResponse, PaymentStats } from "@/types/payment";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchPayments(
  page = 1,
  pageSize = 20,
  status?: string
): Promise<PaymentListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (status) params.set("status", status);

  const res = await fetch(`${API_URL}/api/payments?${params}`);
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}

export async function fetchPaymentStats(): Promise<PaymentStats> {
  const res = await fetch(`${API_URL}/api/payments/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function triggerWebhook(data: Record<string, unknown>): Promise<Payment> {
  const res = await fetch("/api/trigger-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to trigger webhook");
  }
  return res.json();
}
