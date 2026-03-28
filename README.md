# Payment Webhook System

Real-time payment notification system với FastAPI backend và Next.js frontend.

## Features

- ✅ Webhook signature verification (HMAC SHA256)
- ✅ Real-time updates qua Server-Sent Events (SSE)
- ✅ Payment dashboard với live stats
- ✅ Payment history với pagination
- ✅ Test webhook trigger form
- ✅ Toast notifications cho payments mới

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy + SQLite
- SSE (Server-Sent Events)
- HMAC SHA256 signature verification

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- EventSource API (SSE client)

## Local Development

### Prerequisites
- Docker & Docker Compose
- Make (optional)

### Quick Start

```bash
# Clone repo
git clone <your-repo>
cd small_learn

# Deploy với Docker Compose
make deploy

# Hoặc không dùng Make
docker compose up --build -d
```

Services sẽ chạy tại:
- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- API Docs: http://localhost:8001/docs

### Makefile Commands

```bash
make deploy    # Build và start tất cả services
make logs      # Xem logs
make test      # Gửi test webhook
make restart   # Restart services
make down      # Stop services
make clean     # Xóa containers và images
```

## Production Deployment

### Backend → Railway

1. Push code lên GitHub
2. Vào https://railway.app → New Project → Deploy from GitHub
3. Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     ```
     WEBHOOK_SECRET=your-secret-key-change-me
     CORS_ORIGINS=*
     DATABASE_URL=sqlite:///./payments.db
     ```
4. Generate Domain → Copy URL (vd: `https://backend-xxx.up.railway.app`)

### Frontend → Vercel

1. Vào https://vercel.com/new → Import repo
2. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://backend-xxx.up.railway.app
     BACKEND_URL=https://backend-xxx.up.railway.app
     WEBHOOK_SECRET=your-secret-key-change-me
     ```
3. Deploy → Copy URL (vd: `https://payment-app.vercel.app`)

### Update CORS

Quay lại Railway → Backend → Variables:
```
CORS_ORIGINS=https://payment-app.vercel.app
```

## API Endpoints

### Backend (FastAPI)

- `POST /api/webhooks/payment` - Nhận webhook từ payment gateway
- `GET /api/payments` - List payments (pagination)
- `GET /api/payments/stats` - Payment statistics
- `GET /api/payments/{payment_id}` - Get single payment
- `GET /api/events/stream` - SSE stream cho real-time updates
- `GET /health` - Health check

### Frontend (Next.js)

- `GET /` - Dashboard chính
- `POST /api/trigger-webhook` - Test webhook trigger

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=sqlite:///./payments.db
WEBHOOK_SECRET=your-secret-key-change-me
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001
BACKEND_URL=http://localhost:8001
WEBHOOK_SECRET=your-secret-key-change-me
```

## How It Works

1. User điền form "Trigger Webhook" trên dashboard
2. Next.js API route generate HMAC signature và forward đến FastAPI
3. FastAPI verify signature, lưu payment vào SQLite
4. FastAPI broadcast event qua SSE đến tất cả connected clients
5. Dashboard nhận event và update UI real-time
6. Toast notification hiện lên + payment xuất hiện trong history table

## Security

- HMAC SHA256 signature verification cho mọi webhook
- CORS configuration
- Environment variables cho secrets
- Input validation với Pydantic

## Project Structure

```
small_learn/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Settings
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models.py            # Payment model
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── webhook.py           # Signature verification
│   │   └── routers/
│   │       ├── webhooks.py      # Webhook endpoint
│   │       ├── payments.py      # Payment CRUD
│   │       └── events.py        # SSE stream
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx         # Main dashboard
│       │   └── api/trigger-webhook/route.ts
│       ├── components/
│       │   ├── PaymentDashboard.tsx
│       │   ├── PaymentHistory.tsx
│       │   └── WebhookTrigger.tsx
│       ├── hooks/
│       │   └── usePaymentEvents.ts  # SSE hook
│       ├── lib/api.ts
│       └── types/payment.ts
│
├── docker-compose.yml
├── Makefile
└── README.md
```

## License

MIT
