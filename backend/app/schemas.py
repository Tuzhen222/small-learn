from datetime import datetime

from pydantic import BaseModel, Field


class WebhookPayload(BaseModel):
    payment_id: str
    order_id: str
    amount: float = Field(gt=0)
    currency: str = "USD"
    status: str = "pending"
    payment_method: str | None = None
    customer_email: str | None = None
    metadata: dict | None = None


class PaymentResponse(BaseModel):
    id: int
    payment_id: str
    order_id: str
    amount: float
    currency: str
    status: str
    payment_method: str | None
    customer_email: str | None
    metadata: dict | None = None
    created_at: str | None
    updated_at: str | None


class PaymentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    payments: list[PaymentResponse]
