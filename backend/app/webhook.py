import hmac
import hashlib

from fastapi import Header, HTTPException, Request

from app.config import settings


def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected)


async def validate_webhook_signature(
    request: Request,
    x_webhook_signature: str = Header(...),
) -> bytes:
    body = await request.body()
    if not verify_webhook_signature(body, x_webhook_signature, settings.webhook_secret):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    return body
