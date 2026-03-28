import PaymentDashboard from "@/components/PaymentDashboard";
import PaymentHistory from "@/components/PaymentHistory";
import WebhookTrigger from "@/components/WebhookTrigger";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PaymentDashboard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <WebhookTrigger />
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              How it works
            </h3>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Fill the form and click &quot;Send Webhook&quot;</li>
              <li>
                Next.js generates HMAC signature and forwards to FastAPI
              </li>
              <li>FastAPI verifies signature and saves to database</li>
              <li>SSE broadcasts event to all connected clients</li>
              <li>Dashboard updates in real-time</li>
            </ol>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              API Endpoints
            </h3>
            <div className="text-xs text-gray-600 space-y-1 font-mono">
              <p>POST /api/webhooks/payment</p>
              <p>GET /api/payments</p>
              <p>GET /api/payments/stats</p>
              <p>GET /api/events/stream (SSE)</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <PaymentHistory />
      </div>
    </div>
  );
}
