# Agent instructions (Cursor + Antigravity)

This repo (`floaters-web-admin`) is the **Floaters CONNECT Admin Dashboard** — a Next.js web application for platform management, backed by Firebase Firestore.

Both **Cursor** (local) and **Antigravity** (cloud) must follow the same rules so changes stay compatible.

---

## Shared source of truth (do not duplicate or contradict)

| What | Where |
|------|--------|
| Product scope & roles | `.agents/memory/floaters-connect-overview.md` |
| Admin dashboard stack & conventions | `.agents/memory/admin-web-stack.md` |
| Firebase & API conventions | `.agents/memory/firebase-api-conventions.md` |
| Agent skills | `.agents/skills/*/SKILL.md` |
| Durable memory index | `.agents/memory/MEMORY.md` |

---

## Skills — read before acting

Always **read the full SKILL.md** when a task matches. Do not guess workflows.

| When the user or task involves… | Read this skill |
|--------------------------------|-----------------|
| Modifying a dashboard page | `.agents/skills/page-edit-safety/SKILL.md` |
| Firebase / Firestore data wiring | `.agents/skills/firestore-integration/SKILL.md` |

---

## Memory — read when relevant

Start with `.agents/memory/MEMORY.md`, then open linked files:

- **Any admin-web UI work** → `admin-web-stack.md`
- **Product/business logic** → `floaters-connect-overview.md`
- **Firebase/API contracts** → `firebase-api-conventions.md`

---

## Core alignment rules

1. **One codebase** — never fork patterns. Use Next.js App Router, Shadcn/ui, Tailwind CSS variables, next-themes. Do not introduce alternative patterns.
2. **Firebase only** — no PostgreSQL, no Drizzle ORM, no mock/fallback data. All data comes from live Firestore collections.
3. **Minimal diffs** — reuse existing Shadcn components from `src/components/ui/`. No drive-by refactors.
4. **Theme-safe** — use CSS variable tokens (`bg-background`, `text-foreground`, `border-border`, etc.). Never hardcode hex colors in component files.
5. **Dependencies** — check `admin-web-stack.md` before `pnpm add`; explain and get approval for new libs.
6. **Build gates** — after any code change, run `pnpm typecheck` and `pnpm lint` and confirm 0 errors/warnings before reporting done.
7. **Cross-tool memory** — durable preferences belong in `.agents/memory/`. Both Cursor and Antigravity should read the same files.
8. **Windows local dev** — `pnpm install --ignore-scripts` at repo root. Dev server: `pnpm --filter @workspace/admin-web run dev`.

---

## Repo layout (short)

```
artifacts/
  admin-web/     ← Next.js 15 admin panel (primary UI work)
  api-server/    ← NestJS API (Firebase Admin SDK; no DB)
lib/
  firebase/      ← Shared Firebase Admin wrapper (@workspace/firebase)
  api-zod/       ← Zod validation schemas
scripts/         ← Workspace utility scripts
```

---

## Run commands

| Command | What it does |
|---------|-------------|
| `pnpm --filter @workspace/admin-web run dev` | Start Next.js dev server (port 3000) |
| `pnpm --filter @workspace/admin-web run build` | Production build |
| `pnpm --filter @workspace/admin-web run typecheck` | TypeScript type check |
| `pnpm --filter @workspace/admin-web run lint` | ESLint check |
| `pnpm --filter @workspace/api-server run dev` | Start NestJS API server (port 3001) |
| `pnpm --filter @workspace/api-server run typecheck` | API type check |
