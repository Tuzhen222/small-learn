"use client";

import { useEffect, useState } from "react";
import { PaymentStats } from "@/types/payment";
import { usePaymentEvents } from "@/hooks/usePaymentEvents";
import { fetchPaymentStats } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-600",
  completed: "text-green-600",
  failed: "text-red-600",
  refunded: "text-gray-600",
};

const STATUS_BG: Record<string, string> = {
  pending: "bg-yellow-50 border-yellow-200",
  completed: "bg-green-50 border-green-200",
  failed: "bg-red-50 border-red-200",
  refunded: "bg-gray-50 border-gray-200",
};

export default function PaymentDashboard() {
  const { payments, latestPayment, isConnected, dismissNotification } =
    usePaymentEvents();
  const [stats, setStats] = useState<PaymentStats | null>(null);

  useEffect(() => {
    fetchPaymentStats()
      .then(setStats)
      .catch(console.error);

    const interval = setInterval(() => {
      fetchPaymentStats().then(setStats).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, [payments.length]);

  return (
    <div className="space-y-6">
      {/* Notification toast */}
      {latestPayment && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                New Payment: {latestPayment.status}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {latestPayment.payment_id} - ${latestPayment.amount.toFixed(2)}{" "}
                {latestPayment.currency}
              </p>
            </div>
            <button
              onClick={dismissNotification}
              className="text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Connection status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-500">
            {isConnected ? "Live" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard
            label="Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            color="text-green-600"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="text-green-600"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            color="text-yellow-600"
          />
          <StatCard
            label="Failed"
            value={stats.failed}
            color="text-red-600"
          />
        </div>
      )}

      {/* Real-time feed */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Real-time Feed
        </h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">
            Waiting for webhook events...
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {payments.slice(0, 10).map((p) => (
              <div
                key={`${p.payment_id}-${p.updated_at}`}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  STATUS_BG[p.status] || STATUS_BG.pending
                }`}
              >
                <div>
                  <span className="font-mono text-xs">{p.payment_id}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-xs text-gray-600">{p.order_id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">
                    ${p.amount.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      STATUS_COLORS[p.status] || ""
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
