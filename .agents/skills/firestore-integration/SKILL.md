---
name: Firestore integration skill
description: Guidelines and checklist for wiring new Firestore data to admin dashboard pages via the NestJS api-server. Read before adding new Firestore queries or API endpoints.
---

# Firestore Integration Skill

## When to apply

Read this skill before:
- Adding a new Firestore collection query to `admin.service.ts`.
- Adding a new API endpoint to `admin.controller.ts`.
- Fetching new data from the API on any admin dashboard page.

## Architecture reminder

```
admin-web (Next.js)
    ↓  fetch() with Bearer token
api-server (NestJS) — AdminRoleGuard
    ↓  Firebase Admin SDK
Firestore (server-side only)
```

The admin-web **never** calls Firestore directly. All data flows through the API server.

## Checklist — adding a new Firestore query

1. **Check if the collection exists** in the user's Firestore console before coding.
   - Existing: `users`, `driver_profiles`, `runner_profiles`, `payout_profiles`.
   - If the collection doesn't exist yet, inform the user and do NOT ship mock fallback data.

2. **Add the method in `admin.service.ts`**:
   ```typescript
   async getXxx() {
     if (!this.firebaseConfigured) return [];
     try {
       const snap = await this.firestore.collection('collection_name').get();
       const items: any[] = [];
       snap.forEach((doc: any) => items.push({ id: doc.id, ...doc.data() }));
       return items;
     } catch (error: any) {
       this.logger.error(`Error fetching xxx: ${error.message}`);
       return [];
     }
   }
   ```

3. **Add the route in `admin.controller.ts`**:
   ```typescript
   @Get('xxx')
   async getXxx() {
     return this.adminService.getXxx();
   }
   ```

4. **Fetch from admin-web**:
   ```typescript
   const res = await fetch('/api/v1/admin/xxx', {
     headers: { Authorization: `Bearer ${token}` }
   });
   const data = await res.json();
   ```

5. **Run verification**:
   ```bash
   pnpm --filter @workspace/api-server run typecheck
   pnpm --filter @workspace/admin-web run typecheck
   pnpm --filter @workspace/admin-web run lint
   ```

## No mock data rule

If Firestore returns empty:
- ✅ Return `[]` or show an empty state message in the UI.
- ❌ Never return hardcoded mock arrays as fallback.

## Collection name constants

Use `FirestoreCollections` from `@workspace/firebase`:

```typescript
import { FirestoreCollections } from '@workspace/firebase';
// FirestoreCollections.users = 'users'
// FirestoreCollections.driverProfiles = 'driver_profiles'
// FirestoreCollections.runnerProfiles = 'runner_profiles'
```
