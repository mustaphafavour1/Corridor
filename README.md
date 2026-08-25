# CorriDoor

**Global cross-border payments & payout-orchestration platform.** CorriDoor manages the
end-to-end lifecycle of a money transfer — onboarding senders, beneficiaries and payout
partners, through compliance screening, FX, routing and settlement, to reconciliation and
regulatory reporting — across many country corridors, currencies and local payout partners.

Built as a premium, high-trust institutional fintech product. **All data is synthetic** (portfolio demo).

## Tech stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS**
- **Framer Motion** for role-switch / route transitions
- **Recharts** for analytics · **react-day-picker** for themed date filtering
- **Radix UI** primitives · **lucide-react** icons
- In-memory context/state (no backend) with a full synthetic seed layer

## Design system

Dark-first, institutional and dense. Tokens live in `src/app/globals.css` and are wired
into `tailwind.config.ts`, so UI, charts and the calendar all pull from one source.

- **Dirty green** (`#51645A`) surface scale — deep near-black greens up to panel greens.
- **Rose gold** (`#C08A7D`) accent — used sparingly for CTAs, active states and key figures.
- **Semantic status** colours kept deliberately distinct from brand + accent (a compliance product).
- **Typography** — Parkinsans (UI) + JetBrains Mono (references, amounts, keys). ~10px base
  for a very neat, high-density feel; very faint hairline dividers.

## Roles & scoping

Three base roles (**Super Admin**, **Regional Operations Manager**, **Payout Partner/Agent**)
plus custom roles (Compliance Analyst, Treasury Manager), each with a per-module permission
matrix. Region/corridor scoping is driven by `assignedRegions` / `assignedCorridors` on the
user object — never hardcoded. A Super Admin can **preview any persona in real time**: nav,
permitted actions and visible data update without a reload.

## Demo touches

- **Seed toggle** — one switch flips every page between populated live-style data and empty states.
- Realistic synthetic global data across UK / US / EU / Nigeria / Mexico / Philippines / India / Morocco.
- Pre-seeded maker-checker approval queue so dual-control is populated on load.

## Project structure

```
src/
  app/
    (dashboard)/            # authenticated shell + pages
      overview/  transfers/  senders/  corridors/  partners/
    layout.tsx  globals.css  page.tsx
  components/
    layout/                 # sidebar, topbar, role switcher, app shell
    ui/                     # primitives, tables, charts, overlays, inputs
  context/app-provider.tsx  # identity, role switching, scope, demo mode
  lib/
    types.ts                # 24-entity data model
    rbac.ts  nav.ts  utils.ts
    seed/                   # synthetic dataset (reference, parties, activity, compliance, platform)
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Build status

**Foundations + first 5 dashboard pages** are complete:

1. **Overview** — KPIs, transfer-volume trend, inflow/outflow, payout-method mix, top corridors,
   pending-approvals (maker-checker) and alerts, recent transfers.
2. **Transfers** — full lifecycle pipeline, structured references
   (`SND / Corridor / Service / Amount+Ccy / Rail`), filters, pagination, receipt/detail sheet.
3. **Senders & Beneficiaries** — KYC tiers/limits, one-to-many beneficiaries, CSV preview-before-commit.
4. **Corridors & FX** — corridor matrix, FX rates (live vs locked), currency exposure.
5. **Payout Partners & Liquidity** — KYB, coverage, float/pre-funding, scorecards, low-liquidity alerts.

Further modules (Treasury, Reconciliation, Compliance, Approvals queue, Analytics, User
Management, Integration Console, Reports, Audit, Config) and the AI layer are scaffolded in
the navigation and data model, and are next on the build order.
