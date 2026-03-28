"use client";

import { useEffect, useState } from "react";
import { Payment } from "@/types/payment";
import { fetchPayments } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    fetchPayments(page, pageSize)
      .then((res) => {
        setPayments(res.payments);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Payment History
      </h2>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payments yet. Trigger a webhook to create one.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">
                    Payment ID
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">
                    Method
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.payment_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2 font-mono text-xs">
                      {p.payment_id}
                    </td>
                    <td className="py-3 px-2 font-mono text-xs">
                      {p.order_id}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[p.status] || STATUS_COLORS.pending
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {p.payment_method || "-"}
                    </td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages} ({total} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
