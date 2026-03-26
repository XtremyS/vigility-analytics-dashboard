# Vigility Full Stack Challenge - Interactive Product Analytics Dashboard

- JWT authentication (`/register`, `/login`)
- Click tracking (`/track`)
- Aggregated analytics (`/analytics`)
- Filter persistence via cookies
- Bar + line chart interactivity
- Seed script with 100+ records
- Ant Design UI, toasts, loading states, empty states
- Dedicated login and register pages
- Logout + automatic logout on unauthorized responses

## Monorepo Structure

- `apps/api` - FastAPI backend
- `apps/web` - Next.js frontend
- `infra/docker` - Local PostgreSQL compose file

## Local Run

### 1) Backend

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python seed.py
uvicorn app.main:app --reload --port 8000
```

### 2) Frontend

```bash
cd apps/web
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`

### Frontend Routes

- `/login` - Login screen
- `/register` - Register screen
- `/` - Protected dashboard route (redirects to login if not authenticated)

## API Endpoints

- `POST /api/v1/register`
- `POST /api/v1/login`
- `POST /api/v1/track` (JWT required)
- `GET /api/v1/analytics` (JWT required)

## Seed Instructions

From `apps/api`:

```bash
python seed.py
```

This creates:
- 15 users
- 120 feature click records across varied dates and interactions

## Architecture Choices

- **FastAPI + SQLAlchemy** for typed, modular backend APIs.
- **Service layer separation** keeps endpoint logic thin and testable.
- **Next.js + Recharts + Ant Design** for responsive, polished UX and data visualization.
- **Cookie-based filter persistence** to satisfy refresh-state requirement.
- **Track-on-interaction design** ensures every filter/chart action is logged.
- **Axios interceptor + centralized auth helpers** enable auto-logout on 401 responses.

## Frontend UX Features

- Toast notifications for login, register, API failures, and logout.
- Loading spinners during dashboard data fetch and auth bootstrap.
- Empty states for charts when no filtered data is available.
- One-click logout button in dashboard header.
- Automatic session cleanup and redirect when API returns unauthorized.

## Scale Essay (1M write-events/minute)

At 1 million writes per minute, I would separate ingestion from querying by introducing a durable event stream (Kafka/Kinesis/PubSub) in front of storage so the API only validates/authenticates and enqueues events. Stateless consumers would batch writes into a high-throughput store (partitioned Postgres, ClickHouse, or a time-series database), while a separate aggregation pipeline would build precomputed rollups by feature/time bucket for fast dashboard reads. I would add idempotency keys, backpressure controls, and autoscaled workers, then serve analytics from cached/materialized views (Redis + OLAP tables) instead of executing heavy aggregations on the primary transactional path.


## Submission Checklist

- [✅] Push code to GitHub
- [ ] Deploy backend publicly (Render/Railway)
- [ ] Deploy frontend publicly (Vercel/Netlify)
- [ ] Set frontend API URL to deployed backend
- [ ] Include live URL in this README
