---
name: Page edit safety skill
description: Enforces a confirm-before-edit workflow when modifying admin dashboard pages. Prevents unintended multi-file changes.
---

# Page Edit Safety Skill

## When to apply

Load and follow this skill whenever the user asks to **update, change, fix, redesign, tweak, or modify** any admin dashboard page (e.g. Overview, User Directory).

## 4-step workflow

1. **Resolve** — Identify the exact file(s) that need editing (e.g. `src/app/dashboard/users/page.tsx`).
2. **Present** — Tell the user clearly: "I will edit `[filename]` to do `[X]`."
3. **Wait** — Do NOT touch any file until the user explicitly confirms (or the request was already unambiguous).
4. **Lock** — Edit **only the one confirmed file**. Any other file (layout, components, globals.css, etc.) requires separate explicit user permission.

## Why it exists

Dashboard pages are connected to shared layouts, the auth guard, the sidebar, and the theme system. Careless multi-file edits have previously broken navigation, theming, or auth flows. This skill makes every edit deliberate and auditable.

## Key constraint

The single-file lock is strict. The sidebar layout (`dashboard/layout.tsx`), global CSS (`globals.css`), shared components (`src/components/`), and other pages all require separate explicit user permission before being touched.

## Exemptions

The following are always safe to touch in a single response **without extra confirmation**:
- The file the user pointed to directly (e.g. "fix the users page").
- `task.md` and `walkthrough.md` artifacts (progress tracking only).
