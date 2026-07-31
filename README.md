# Qollab - V.I.M Engine Cross-Store Dynamic Package Platform

"Qollab" is a Next.js 15 App Router platform built with Firebase (Firestore, Firebase Auth, Firebase Storage), Portone / Toss Payments Adapters, and Solapi Alimtalk notification hooks.

---

## Technical Stack & Architecture

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Auth**: Firebase Firestore & Firebase Admin SDK (Role-based Custom Claims)
- **Payment Gateway**: Portone / Toss Payments Adapter (`lib/adapters/payment-adapter.ts`)
- **Notifications**: Solapi Kakao Alimtalk Hooks (`lib/services/alimtalk-service.ts`)

---

## Core Domain Rules & Engine Isolation

### 1. V.I.M Engine Isolation (`lib/domain/vim-matching.ts`)
All V.I.M 6-axis matching logic is encapsulated exclusively in `lib/domain/vim-matching.ts`.
- **Core Matching Formula**:
  $$\text{VIMSCT} = 0.124 \times V + 0.199 \times I + 0.176 \times M + 0.146 \times C + 0.199 \times S + 0.156 \times T$$
- Includes dynamic weight decay formula $W(t) = W_{\text{base}} \times e^{-\lambda t}$ and 42 external variable multipliers.

### 2. Money Values & Snapshots
- All money values are strictly KRW integers (`number`). Floating-point types are prohibited.
- `Math.round()` is enforced across all calculations. Residual remainders are allocated to the Anchor slot.
- Settlement amounts are saved as immutable snapshots in `vouchers.settle_amount` upon payment confirmation and never recalculated dynamically during display.

### 3. Atomic Transactions & Security
- Voucher status updates (`issued` -> `used`) are executed via atomic `db.runTransaction()` in `/api/vouchers/use`.
- Role-based security is enforced via Firebase Custom Claims (`request.auth.token.role`) in `firestore.rules` and Next.js `middleware.ts`.

### 4. Benchmarked Feature UIs
- **Kmong Style**: Mode Toggle Switch ("개인" <-> "Biz") & AI Prompt Bar in `components/Header.tsx` & Consumer Home.
- **MyRealTrip Style**: Map Itinerary UI showing pins & travel time between stores in `components/PackageItineraryMap.tsx`.
- **Cashnote Style**: Daily sales summary & weekly settlement approval dashboards in `app/owner/settlements/page.tsx`.
- **Goodsixty Style**: Local merchant story labels on package detail cards.

---

## Directory Structure

```
d:/qollab
├── app/
│   ├── admin/
│   │   ├── settlements/page.tsx   # Admin Settlement & Payout Control Center
│   │   └── stores/page.tsx        # Admin Store Review & Approval Dashboard
│   ├── api/
│   │   ├── admin/settlements/route.ts
│   │   ├── admin/stores/route.ts
│   │   ├── auth/custom-claims/route.ts
│   │   ├── payments/confirm/route.ts
│   │   └── vouchers/use/route.ts
│   ├── auth/login/page.tsx        # Firebase Social & Email Auth
│   ├── my-vouchers/page.tsx       # Consumer Voucher Vault & QR Redemption
│   ├── orders/checkout/page.tsx   # Portone / Toss Payments Checkout
│   ├── owner/
│   │   ├── packages/new/page.tsx  # Owner Package Planning & V.I.M Matching
│   │   ├── settlements/page.tsx   # Merchant Cashnote Settlement Dashboard
│   │   └── stores/
│   │       ├── page.tsx           # Owner Stores List
│   │       └── new/page.tsx       # Store Registration Form
│   ├── packages/
│   │   ├── page.tsx               # Packages Explorer
│   │   └── [packageId]/page.tsx   # Package Detail & Map Itinerary
│   ├── unauthorized/page.tsx      # 403 Role Fallback Page
│   ├── layout.tsx
│   └── page.tsx                   # Consumer Home
├── components/
│   ├── Header.tsx                 # Kmong-style Top Nav
│   └── PackageItineraryMap.tsx    # MyRealTrip Course Map
├── lib/
│   ├── adapters/payment-adapter.ts
│   ├── domain/vim-matching.ts     # Isolated V.I.M Matching Engine
│   ├── firebase/
│   │   ├── admin.ts
│   │   └── client.ts
│   ├── services/
│   │   ├── alimtalk-service.ts
│   │   ├── package-service.ts
│   │   ├── settlement-service.ts
│   │   └── store-service.ts
│   ├── types/schema.ts            # Firestore TypeScript Schemas
│   └── utils.ts                   # KRW Currency & Slot Residual Split
├── firestore.rules
├── firestore.indexes.json
├── middleware.ts
└── .env.local
```

---

## Build & Production Verification

```bash
# Verify TypeScript Compilation
npx tsc --noEmit

# Production Build
npm run build
```
Result: All 21 routes prerendered / compiled cleanly with 0 errors.
