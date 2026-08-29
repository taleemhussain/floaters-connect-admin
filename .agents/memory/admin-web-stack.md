---
name: Admin Web Stack
description: Approved libraries, forbidden patterns, and implementation rules for the floaters-web-admin Next.js admin panel. Check before installing anything or creating new components.
---

# Admin Web Stack Rules

## Approved stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **Package manager** | pnpm workspaces |
| **Styling** | Tailwind CSS (via CSS variables) — never hardcode hex colors |
| **Component library** | Shadcn/ui — use components from `src/components/ui/` |
| **Icons** | Lucide React |
| **Theming** | `next-themes` — `defaultTheme="light"`, `enableSystem={false}` |
| **Auth** | Firebase Auth (client-side ID token), passed as Bearer header to API |
| **Backend** | NestJS `api-server` — Firebase Admin SDK via `@workspace/firebase` |
| **Database** | Firebase Firestore only — no SQL, no Drizzle, no Prisma |
| **HTTP from UI** | Raw `fetch()` with `Authorization: Bearer <token>` header |

## Theme system

- All color values use CSS variable tokens: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`.
- Light theme is default. Dark mode supported via `.dark` class.
- Never hardcode hex/rgb/hsl color values inside component files.
- Sidebar uses `--sidebar-background` and `--sidebar-foreground` tokens.

## File structure

```
artifacts/admin-web/
  src/
    app/
      dashboard/          ← Protected dashboard pages (layout.tsx gates auth)
        layout.tsx        ← Sidebar, nav, auth guard
        page.tsx          ← Overview (live Firebase stats)
        users/page.tsx    ← User Directory + Profile Sheet
    components/
      ui/                 ← Shadcn/ui primitives (do not modify unless necessary)
      theme-toggle.tsx    ← Light/Dark toggle (no System option)
    providers/
      auth-provider.tsx   ← Firebase auth context (token available via useAuth())
      theme-provider.tsx  ← next-themes ThemeProvider wrapper
    hooks/
    lib/
      utils.ts            ← cn() utility
```

## Hard rules

- **No mock/fallback data** — return `[]` or empty objects from the API if Firestore is empty. Never ship hardcoded placeholder arrays.
- **No PostgreSQL / Drizzle / Prisma** — Firestore is the only database.
- **Reuse before creating** — check `src/components/ui/` before adding new components.
- **One page per route** — all dashboard pages live under `src/app/dashboard/`.
- **Build gates** — `pnpm typecheck` and `pnpm lint` must pass with 0 errors after every change.

## Firestore collections in use

| Collection | Used for |
|------------|----------|
| `users` | All registered accounts |
| `driver_profiles` | Driver-specific profile details |
| `runner_profiles` | Runner-specific profile details |
| `payout_profiles` | Payout/bank account details |

## Forbidden

- PostgreSQL, Drizzle, Prisma, MobX, Redux, raw SQL.
- Hardcoded color values in component files.
- Mock fallback arrays in production API service code.
- `enableSystem` on ThemeProvider (always `enableSystem={false}`).
