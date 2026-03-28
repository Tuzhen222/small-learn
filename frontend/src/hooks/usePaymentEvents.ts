"use client";

import { useEffect, useState, useCallback } from "react";
import { Payment } from "@/types/payment";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function usePaymentEvents() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const eventSource = new EventSource(`${API_URL}/api/events/stream`);

    eventSource.onopen = () => setIsConnected(true);

    eventSource.addEventListener("payment_created", (event) => {
      const payment: Payment = JSON.parse(event.data);
      setLatestPayment(payment);
      setPayments((prev) => [payment, ...prev].slice(0, 50));
    });

    eventSource.addEventListener("payment_updated", (event) => {
      const payment: Payment = JSON.parse(event.data);
      setLatestPayment(payment);
      setPayments((prev) =>
        prev.map((p) => (p.payment_id === payment.payment_id ? payment : p))
      );
    });

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const dismissNotification = useCallback(() => setLatestPayment(null), []);

  return { payments, latestPayment, isConnected, dismissNotification };
}
