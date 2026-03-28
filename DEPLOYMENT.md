# Deployment Guide

## Backend (Render.com - Free)

1. Push code lên GitHub
2. Vào https://render.com → New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `DATABASE_URL` = `sqlite:///./payments.db`
     - `WEBHOOK_SECRET` = `your-secret-key-change-me`
     - `CORS_ORIGINS` = `https://your-frontend.vercel.app`

5. Deploy → Copy backend URL (vd: `https://payment-api-xxx.onrender.com`)

## Frontend (Vercel)

1. Vào https://vercel.com → New Project
2. Import GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL` = `https://payment-api-xxx.onrender.com`
     - `BACKEND_URL` = `https://payment-api-xxx.onrender.com`
     - `WEBHOOK_SECRET` = `your-secret-key-change-me`

4. Deploy

## Sau khi deploy

1. Update CORS_ORIGINS trên backend với URL frontend thực tế
2. Test webhook tại frontend URL
3. Done!

## Alternative: Railway (Deploy cả 2 cùng lúc)

1. Vào https://railway.app
2. New Project → Deploy from GitHub
3. Add 2 services:
   - Service 1: Root = `backend`, Start = `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Service 2: Root = `frontend`, Start = `npm start`
4. Set env variables cho mỗi service
5. Railway tự generate URLs cho cả 2
