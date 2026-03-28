"use client";

import { useState } from "react";
import { PaymentStatus } from "@/types/payment";
import { triggerWebhook } from "@/lib/api";

const STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export default function WebhookTrigger() {
  const [form, setForm] = useState({
    payment_id: `pay_${Date.now()}`,
    order_id: `ord_${Date.now()}`,
    amount: "99.99",
    currency: "USD",
    status: "completed" as PaymentStatus,
    payment_method: "credit_card",
    customer_email: "customer@example.com",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await triggerWebhook(form);
      setSuccess(`Webhook sent! Payment ${form.payment_id} -> ${form.status}`);
      setForm((prev) => ({
        ...prev,
        payment_id: `pay_${Date.now()}`,
        order_id: `ord_${Date.now()}`,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Trigger Webhook
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment ID
            </label>
            <input
              type="text"
              value={form.payment_id}
              onChange={(e) =>
                setForm({ ...form, payment_id: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={form.order_id}
              onChange={(e) =>
                setForm({ ...form, order_id: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) =>
                setForm({ ...form, currency: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as PaymentStatus,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <input
              type="text"
              value={form.payment_method}
              onChange={(e) =>
                setForm({ ...form, payment_method: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Email
            </label>
            <input
              type="email"
              value={form.customer_email}
              onChange={(e) =>
                setForm({ ...form, customer_email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors"
        >
          {loading ? "Sending..." : "Send Webhook"}
        </button>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm bg-green-50 p-2 rounded">
            {success}
          </p>
        )}
      </form>
    </div>
  );
}
