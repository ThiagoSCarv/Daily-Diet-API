# Daily Diet API

REST API for daily meal tracking and diet monitoring. Users register meals and get metrics on their diet consistency.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL
- **ORM/Query Builder:** Knex.js
- **Validation:** Zod
- **Documentation:** Scalar UI (`GET /docs`)
- **Testing:** Vitest + Supertest
- **Linter/Formatter:** Biome.js

## Prerequisites

- Node.js 20+
- pnpm 11+
- Docker + Docker Compose

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env

# 3. Start database (creates both development and test databases)
docker compose up -d

# 4. Run migrations
pnpm migrate

# 5. Start development server
pnpm dev
```

The server starts at `http://localhost:3333`.  
Interactive API documentation is available at `http://localhost:3333/docs`.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3333` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://docker:docker@localhost:5432/daily_diet` |

## Authentication

Authentication is cookie-based — no JWT. Call `POST /users` to create an account; the response sets a `sessionId` HttpOnly cookie that must be sent on every subsequent request.

## API Routes

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/users` | — | Create a user and set session cookie |
| `POST` | `/meals` | ✅ | Register a new meal |
| `GET` | `/meals` | ✅ | List all meals for the authenticated user |
| `GET` | `/meals/:id` | ✅ | Get a single meal by ID |
| `PUT` | `/meals/:id` | ✅ | Edit an existing meal |
| `DELETE` | `/meals/:id` | ✅ | Delete a meal |
| `GET` | `/users/metrics` | ✅ | Get diet metrics for the authenticated user |

### Meal fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Meal name |
| `description` | `string` | Meal description |
| `datetime` | ISO 8601 string | When the meal was eaten |
| `is_on_diet` | `boolean` | Whether the meal is within the diet |

### Metrics response

```json
{
  "total": 10,
  "on_diet": 7,
  "off_diet": 3,
  "best_streak": 5
}
```

`best_streak` is the longest consecutive sequence of on-diet meals, ordered by `datetime` ascending.

## Commands

```bash
# Development
pnpm dev                # Start server with watch mode
pnpm build              # Compile TypeScript
pnpm start              # Start compiled server

# Database
pnpm migrate            # Run pending migrations
pnpm migrate:rollback   # Rollback last migration
pnpm seed               # Run seeds

# Tests
pnpm test               # Run all tests
pnpm test:watch         # Watch mode

# Lint & Format
pnpm lint               # Biome lint
pnpm format             # Biome format
```

## Testing

Tests run against a dedicated test database (`daily_diet_test`) created automatically by `docker/init-test-db.sql` on the first `docker compose up`.

```bash
pnpm test
```

## Project Structure

```
src/
├── config/         # Environment variable validation
├── db/
│   ├── migrations/ # Knex migrations
│   ├── seeds/      # Development seeds
│   └── knex.ts     # Knex instance
├── middlewares/    # authenticate hook
├── modules/
│   ├── users/      # POST /users
│   └── meals/      # /meals and /users/metrics
├── plugins/        # Fastify plugins (swagger, cookie)
├── types/          # Shared TypeScript types
├── utils/          # errors, jsonSchema helpers
├── app.ts          # Fastify app factory
└── server.ts       # Entry point

test/
├── fixtures/       # Factory functions for test data
├── helpers/        # Database helpers
└── integration/    # Supertest integration tests
```
