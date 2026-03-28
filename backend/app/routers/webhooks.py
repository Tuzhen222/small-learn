import json

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Payment
from app.schemas import PaymentResponse
from app.webhook import verify_webhook_signature
from app.config import settings
from app.routers.events import event_manager

router = APIRouter()


@router.post("/payment", response_model=PaymentResponse, status_code=200)
async def receive_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.body()

    # Verify signature
    signature = request.headers.get("x-webhook-signature", "")
    if not verify_webhook_signature(body, signature, settings.webhook_secret):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    payload = json.loads(body)

    # Validate required fields
    required = ["payment_id", "order_id", "amount", "status"]
    for field in required:
        if field not in payload:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    valid_statuses = {"pending", "completed", "failed", "refunded"}
    if payload["status"] not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {valid_statuses}",
        )

    # Find existing payment
    payment = db.query(Payment).filter(
        Payment.payment_id == payload["payment_id"]
    ).first()

    metadata_json = json.dumps(payload["metadata"]) if payload.get("metadata") else None

    if payment:
        payment.order_id = payload["order_id"]
        payment.amount = payload["amount"]
        payment.currency = payload.get("currency", "USD")
        payment.status = payload["status"]
        payment.payment_method = payload.get("payment_method")
        payment.customer_email = payload.get("customer_email")
        payment.metadata_ = metadata_json
        event_type = "payment_updated"
    else:
        payment = Payment(
            payment_id=payload["payment_id"],
            order_id=payload["order_id"],
            amount=payload["amount"],
            currency=payload.get("currency", "USD"),
            status=payload["status"],
            payment_method=payload.get("payment_method"),
            customer_email=payload.get("customer_email"),
            metadata_=metadata_json,
        )
        db.add(payment)
        event_type = "payment_created"

    db.commit()
    db.refresh(payment)

    await event_manager.broadcast(event_type, payment.to_dict())

    return payment.to_dict()
