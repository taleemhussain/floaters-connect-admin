---
name: Firebase API conventions
description: Auth, Firestore, and endpoint contracts for the admin panel. Read before adding new API routes or Firestore queries.
---

# Firebase + API conventions (Admin Panel)

## Architecture

- **Identity:** Firebase Auth on the admin-web client (JS SDK) — Google Sign-In only.
- **API auth:** `Authorization: Bearer <Firebase ID token>` on every protected route.
- **NestJS:** verifies tokens with Admin `verifyIdToken` (`FirebaseAuthGuard`) + `AdminRoleGuard` (checks `users/{uid}.role === 'admin'`).
- **Firestore:** Admin SDK only via NestJS (`@workspace/firebase`). The admin-web never talks to Firestore directly — all data goes through the API server.
- **HTTP from UI:** Raw `fetch()` calls to `/api/v1/admin/*` with Bearer header. No Axios, no generated client.

## Admin API endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/admin/users` | Lists all `users` collection documents |
| POST | `/api/v1/admin/users/:uid/toggle-ban` | Toggles `isBanned` field on user document |
| POST | `/api/v1/admin/users/:uid/verify` | Sets `onboardingStatus: 'registered'` |
| GET | `/api/v1/admin/users/:uid/profile` | Returns `{ user, profile }` — profile is from `driver_profiles` or `runner_profiles` based on role |

## Firestore collections

Collection constants live in `FirestoreCollections` (`lib/firebase/src/firestore/collections.ts`).

| Collection | Document | Doc type | When used |
|------------|----------|----------|-----------|
| `users` | `{uid}` | `UserDoc` | All admin reads/writes |
| `driver_profiles` | `{uid}` | `DriverProfileDoc` | Driver profile detail view |
| `runner_profiles` | `{uid}` | `RunnerProfileDoc` | Runner profile detail view |
| `payout_profiles` | `{uid}` | `PayoutProfileDoc` | Financial overview (read only, last4 only) |

## Error handling rule

If a Firestore query returns empty or throws, **return `[]` or `{ success: false, message }` — never fall back to mock/hardcoded data.**

## Env vars

| Package | Variables |
|---------|-----------|
| `api-server` | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET` |
| `admin-web` | `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` |

Never put the service-account private key in `admin-web` or in git.
