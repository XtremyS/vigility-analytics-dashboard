# Vigility Full Stack Challenge - Interactive Product Analytics Dashboard

- JWT authentication (`/register`, `/login`)
- Click tracking (`/track`)
- Aggregated analytics (`/analytics`)
- Filter persistence via cookies
- Bar + line chart interactivity
- Seed script with 100+ records

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
- **Next.js + Recharts** for responsive interactive charts.
- **Cookie-based filter persistence** to satisfy refresh-state requirement.
- **Track-on-interaction design** ensures every filter/chart action is logged.


## Submission Checklist

- [✅] Push code to GitHub
- [ ] Deploy backend publicly (Render/Railway)
- [ ] Deploy frontend publicly (Vercel/Netlify)
- [ ] Set frontend API URL to deployed backend
- [ ] Include live URL in this README
