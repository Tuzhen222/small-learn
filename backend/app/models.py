from datetime import datetime, timezone

from sqlalchemy import String, Numeric, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    payment_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    order_id: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    status: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    payment_method: Mapped[str | None] = mapped_column(String(50))
    customer_email: Mapped[str | None] = mapped_column(String(255))
    metadata_: Mapped[str | None] = mapped_column("metadata", Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "payment_id": self.payment_id,
            "order_id": self.order_id,
            "amount": float(self.amount),
            "currency": self.currency,
            "status": self.status,
            "payment_method": self.payment_method,
            "customer_email": self.customer_email,
            "metadata": self.metadata_,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
