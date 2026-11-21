# Explore Hail

Smart Tourism Platform for Hail Region

## Graduation Project II

Explore Hail is a web-based smart tourism platform designed to improve the tourism experience in Hail Region.

## Team

- Ali Aljedaie — Project Manager
- Meshal Altamimi — UI/UX & Web UI
- Ziyad Alghadban — Frontend Developer
- Ahmed Alsdairi — Backend Developer
- Faisal Almarshedi — Database Engineer
- Nawaf Alsaqabi — AI Specialist

## Local development

From the repository root (Node.js 22.12+):

```bash
npm run setup
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.
The UI runs at http://localhost:5173 and the API at http://localhost:3000.
`npm run build` checks TypeScript and builds the UI.

Local development uses the 18 existing seed attractions and 11 seed services without requiring MySQL.
To use a database, copy `backend/.env.example` to `backend/.env`, set
`DATABASE_MODE=mysql`, and configure the `DB_*` values. Import `database/schema.sql`
then `database/update_seed_data.sql` into MySQL. Production defaults to MySQL.
The preview snapshot can be refreshed with `node scripts/snapshot-attractions.cjs`.
Refresh the service snapshot with `node scripts/snapshot-services.cjs`.

Set `AI_API_KEY` in `backend/.env` to enable the remote smart planner.
Without a key, the UI keeps its local itinerary. Bookings and provider/admin sign-in
require MySQL and the migrations in `database/`; demo mode only previews the catalog.
Inscription translation is simulated.

## Project Structure

- `frontend/` — Web frontend
- `backend/` — Backend and APIs
- `database/` — Database schema and related files
- `ai/` — AI module
- `docs/` — Project documentation

## Git Workflow

The default development branch is:

`develop`

Each team member works on a separate feature branch:

- `feature/frontend-setup`
- `feature/ui-implementation`
- `feature/backend-setup`
- `feature/database-schema`
- `feature/ai-translation`

## Workflow

1. Work only on your assigned branch.
2. Commit your changes.
3. Push changes to your branch.
4. Create a Pull Request to `develop`.
5. Wait for review before merging.

Do not push directly to `main` or `develop`.

## Branches

- `main` — Stable version
- `develop` — Team integration branch
- `feature/*` — Individual development work
