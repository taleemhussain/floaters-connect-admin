---
name: Floaters CONNECT Overview
description: Full product scope, roles, payment model, operational workflow, and key screens for the Floaters CONNECT peer-to-peer gig-delivery marketplace. Essential reading for any admin panel work.
---

## App Identity

- **Name:** Floaters CONNECT
- **Tagline:** Smart Match Technology
- **Core Mission:** A peer-to-peer gig-delivery marketplace that connects Drivers (vehicle owners making deliveries) with Runners (on-foot/transit helpers) using an AI-driven Smart Match system. Sectors served: Food, Grocery, Logistics.

---

## User Roles

| Attribute | Driver | Runner |
|-----------|--------|--------|
| Primary function | Owns a vehicle; originates delivery requests and pays for the service | On-foot/transit helper; fulfils the last-mile or assist portion of the job |
| Vehicle required | Yes (Van, Sedan, or Truck registered at onboarding) | No vehicle required |
| Skill tags | Vehicle type | Selectable: Heavy Lifting, Grocery Sorting, Express Sprint, etc. |
| Payout direction | Pays into platform (ACH bank draft) | Receives payout from platform (cashes out to wallet/bank) |

**Why:** The Driver/Runner split is the core product distinction. Every admin decision (KYC approval, ban, profile review) must respect which role the account holds.

---

## Operational Workflow

```
Request → Smart Match → Meet → OTP → Execute → Pay → Rate
```

1. **Request** — Driver posts a job with pickup/drop-off, sector, and required skill tags.
2. **Smart Match** — Algorithm ranks available Runners and presents the best match.
3. **Meet** — Driver and Runner navigate to the agreed meet point.
4. **OTP Verification** — Runner presents a one-time passcode to the Driver to confirm physical handoff.
5. **Execute** — Runner carries out the job. Live tracking continues.
6. **Pay** — Platform collects from Driver via ACH bank draft and disburses to Runner.
7. **Rate** — Both parties rate each other; ratings feed back into the Smart Match ranking.

---

## Payment & Payout Model

- **Default split:** 60% to Runner / 40% retained by platform.
- **Driver payment method:** ACH bank draft.
- **Runner payout method:** Stripe Connect (primary) or PayPal Hyperwallet (secondary/international).

---

## Admin Panel Responsibilities

The admin panel (`floaters-web-admin`) is responsible for:

- **User management:** View all registered accounts, inspect driver/runner profiles, approve KYC documents, toggle bans.
- **Onboarding verification:** Review and approve submitted identity documents and vehicle info.
- **Platform oversight:** Monitor live user counts, driver/runner distribution, and pending verifications.

---

## Firestore Collections (Admin reads)

| Collection | Document pattern | Purpose |
|------------|-----------------|---------|
| `users` | `{uid}` | Auth accounts + role + onboarding status |
| `driver_profiles` | `{uid}` | Vehicle info, sectors, documents |
| `runner_profiles` | `{uid}` | Skills, identity docs |
| `payout_profiles` | `{uid}` | Bank account details (last4 only via API) |

---

## Branding

- **Primary colour:** Crimson Red `#e32424`
- **Light mode:** Off-white backgrounds, navy text, red interactive highlights
- **Dark mode:** Charcoal-black (`#09090b` background), red accents — no blue/navy cast
- **Logo:** White shield icon (`ShieldCheck`) on red rounded square background
