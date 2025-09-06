# Deployment Strategy

## Frontend (Vercel)
- Deploy only `apps/web` 
- Ignore `apps/api` completely
- Use environment variables to point to deployed API

## Backend (Render)  
- Deploy only `apps/api`
- Use `render.yaml` for configuration
- Connect to Neon PostgreSQL database

## Setup Instructions

### 1. Deploy Backend on Render

1. Go to [Render.com](https://render.com)
2. Connect your GitHub repo
3. Create new Web Service
4. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.11+

### 2. Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com) 
2. Import your GitHub repo
3. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && npm run build --filter=web`
   - **Install Command**: `cd ../.. && npm install`

### 3. Connect Frontend to Backend

Add environment variables to Vercel:
```
NEXT_PUBLIC_API_URL=https://your-api-name.onrender.com
```
