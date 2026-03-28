from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import webhooks, payments, events


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Payment Webhook API",
    description="API nhận webhook thanh toán và quản lý payments",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
app.include_router(events.router, prefix="/api/events", tags=["events"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
