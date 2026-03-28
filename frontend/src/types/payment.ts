export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: number;
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string | null;
  customer_email: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaymentListResponse {
  total: number;
  page: number;
  page_size: number;
  payments: Payment[];
}

export interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
  revenue: number;
}

export interface WebhookFormData {
  payment_id: string;
  order_id: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  customer_email: string;
}
