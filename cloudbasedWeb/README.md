# Food Waste Guardian (Proof-of-Concept)

Sustainability application to track, analyze and reduce food waste for communities and campus kitchens.

## Features
- Submit waste report (user, category, weight, description)
- List reports
- Dashboard summarizing total waste by category
- Modular backend and frontend
- CI test workflow ready

## Local development

1. Backend
    - `cd backend`
    - `npm install`
    - `npm run migrate`
    - `npm run dev`

2. Frontend
    - `cd frontend`
    - `npm install`
    - `npm run dev`

The frontend uses `http://localhost:4000` by default; set `VITE_API_BASE` in `.env` if different.

## Tests
- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

## Deployment
- Backend: any Node host (Render, AWS Elastic Beanstalk, Azure App Service)
- Frontend: Vercel or Netlify

## Architecture docs
- `docs/report.md` contains full research/design/deployment report.
