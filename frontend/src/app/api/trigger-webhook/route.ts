import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const secret = process.env.WEBHOOK_SECRET!;
    const payload = JSON.stringify(body);
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${apiUrl}/api/webhooks/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
      },
      body: payload,
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { detail: err.detail || "Backend error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { detail: "Failed to trigger webhook" },
      { status: 500 }
    );
  }
}
