from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Payment
from app.schemas import PaymentResponse, PaymentListResponse

router = APIRouter()


@router.get("", response_model=PaymentListResponse)
def list_payments(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
):
    query = db.query(Payment)
    if status:
        query = query.filter(Payment.status == status)

    total = query.count()
    payments = query.order_by(Payment.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()

    return PaymentListResponse(
        total=total,
        page=page,
        page_size=page_size,
        payments=[p.to_dict() for p in payments],
    )


@router.get("/stats")
def payment_stats(db: Session = Depends(get_db)):
    total = db.query(Payment).count()
    completed = db.query(Payment).filter(Payment.status == "completed").count()
    pending = db.query(Payment).filter(Payment.status == "pending").count()
    failed = db.query(Payment).filter(Payment.status == "failed").count()
    refunded = db.query(Payment).filter(Payment.status == "refunded").count()

    total_amount = db.query(Payment).filter(
        Payment.status == "completed"
    ).all()
    revenue = sum(float(p.amount) for p in total_amount)

    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "failed": failed,
        "refunded": refunded,
        "revenue": revenue,
    }


@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: str, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment.to_dict()
