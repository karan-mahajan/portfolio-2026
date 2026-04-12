# Portfolio

A personal portfolio website built with [Next.js](https://nextjs.org/) and [Payload CMS](https://payloadcms.com/) as the headless CMS backend.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **CMS**: Payload CMS v3 (self-hosted, admin at `/admin`)
- **Database**: PostgreSQL (via `@payloadcms/db-postgres`)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, GSAP
- **3D**: React Three Fiber / Drei
- **Rich Text**: Lexical editor
- **Language**: TypeScript

## Project Structure

```
src/
├── app/
│   ├── (frontend)/        # Public-facing pages
│   └── (payload)/         # Payload admin & API routes
├── blocks/                # Page builder blocks
│   ├── Hero/
│   ├── About/
│   ├── Experience/
│   ├── Projects/
│   ├── Skills/
│   ├── Content/
│   ├── CallToAction/
│   └── MediaBlock/
├── collections/           # Payload collections (Pages, Projects, Experience, Media, Users)
├── Header/                # Global header config
├── migrations/            # Database migrations
└── providers/             # React context providers (Theme, etc.)
```

## Local Development

### Prerequisites

- Node.js `^18.20.2` or `>=20.9.0`
- pnpm `^9` or `^10`
- PostgreSQL instance

### Setup

1. Clone the repo and install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required env vars:
   - `DATABASE_URL` — PostgreSQL connection string
   - `PAYLOAD_SECRET` — Secret key for Payload CMS

3. Run database migrations:

   ```bash
   pnpm payload migrate
   ```

4. Start the dev server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS admin.

### Docker (Optional)

A `docker-compose.yml` is included to run a local PostgreSQL instance:

```bash
docker-compose up -d
```

Update `DATABASE_URL` in your `.env` to point to the local container (e.g. `postgresql://postgres:postgres@127.0.0.1:5432/portfolio`).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run all tests (integration + e2e) |
| `pnpm test:int` | Run Vitest integration tests |
| `pnpm test:e2e` | Run Playwright e2e tests |
| `pnpm payload migrate` | Run database migrations |
| `pnpm generate:types` | Regenerate Payload TypeScript types |
