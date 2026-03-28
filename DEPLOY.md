# Payment Webhook System - Deployment Guide

## Architecture
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (FastAPI)

## Deploy Backend to Railway

### 1. Push code to GitHub
```bash
cd /mnt/g/self-learn/small_learn
git init
git add .
git commit -m "Payment webhook system"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy on Railway
1. Go to https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. **Add Service** → **From Repo**
5. Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     ```
     WEBHOOK_SECRET=your-secret-key-change-me
     CORS_ORIGINS=*
     DATABASE_URL=sqlite:///./payments.db
     ```
6. **Deploy** → Copy the generated URL (e.g., `https://payment-backend-production.up.railway.app`)

### 3. Generate Domain
- Go to **Settings** → **Networking** → **Generate Domain**
- Copy the public URL

## Deploy Frontend to Vercel

### 1. Deploy on Vercel
1. Go to https://vercel.com/new
2. **Import Git Repository** → Select your repo
3. **Configure Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 2. Environment Variables
Add these in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://payment-backend-production.up.railway.app
BACKEND_URL=https://payment-backend-production.up.railway.app
WEBHOOK_SECRET=your-secret-key-change-me
```

### 3. Deploy
Click **Deploy** → Copy frontend URL (e.g., `https://payment-app.vercel.app`)

## Final Step: Update CORS

Go back to Railway → Backend service → Variables:
```
CORS_ORIGINS=https://payment-app.vercel.app
```

Redeploy backend.

## Test

1. Open `https://payment-app.vercel.app`
2. Fill webhook form and submit
3. Check real-time updates on dashboard

## URLs
- Frontend: `https://payment-app.vercel.app`
- Backend: `https://payment-backend-production.up.railway.app`
- API Docs: `https://payment-backend-production.up.railway.app/docs`
