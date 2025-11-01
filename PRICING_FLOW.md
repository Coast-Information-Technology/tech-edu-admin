# Admin Pricing Flow Documentation

## Overview
This document explains the complete flow of how pricing works in the **TechEdu Solution Admin** dashboard system, from API data to UI display and back. 

**Important**: 
- This flow is specifically for **Admin users only**
- All product creation, editing, and pricing management happens in the **Admin Dashboard**
- Regular users/customers do NOT have access to these pages
- Admin authentication is required for all pricing API endpoints

**Admin Access Requirements**:
- Must be authenticated as admin
- Pages are under `/app/dashboard/products/*` route
- API endpoints require admin token authentication

---

## 1. Pricing Type Structure

### Core Types (`lib/constants/pricing.ts`)

```typescript
// Main pricing model: determines if it's one-time or recurring
type PriceModel = "one_time" | "subscription"

// Price basis: determines how pricing is calculated
type PriceBasis = "flat" | "per_unit"

// Complete pricing interface
interface Pricing {
  model: PriceModel           // "one_time" | "subscription"
  priceBasis: PriceBasis      // "flat" | "per_unit"
  currency: string
  
  // Flat pricing fields (required when priceBasis === "flat")
  basePrice?: number
  
  // Per-unit pricing fields (required when priceBasis === "per_unit")
  unitName?: "person" | "team"
  tierType?: TierType        // "volume" | "stairstep"
  tiers?: Tier[]             // Array of tier definitions
  
  // Common fields
  minQty?: number
  maxQty?: number
  taxInclusive?: boolean
  vatPercentage?: number
  discountPercentage?: number
  
  // Subscription-specific
  interval?: Interval        // "hour" | "day" | "week" | "month" | "year"
  intervalCount?: number
  
  // Installments (one_time only)
  allowInstallments?: boolean
  installments?: InstallmentsConfig
}
```

---

## 2. Data Flow Overview

```
API Response → Data Mapping → Form State → User Input → Validation → Normalization → API Request
     ↓              ↓            ↓           ↓            ↓             ↓              ↓
Display         Transform    PricingForm  onChange    validate   normalize     POST/PATCH
                                                         Pricing    Pricing
```

---

## 3. Creating a New Product (Admin Flow)

### Step 1: Initial State (Admin Create Page)

**File**: `app/dashboard/products/new/page.tsx`  
**Access**: Admin dashboard only

```typescript
const [pricing, setPricing] = useState<Pricing>({
  model: "one_time",
  priceBasis: "flat",
  currency: "gbp",
  taxInclusive: false,
  vatPercentage: 0,
  discountPercentage: 0,
  basePrice: 0,
  minQty: 1,
  maxQty: 1000,
  allowInstallments: false,
});
```

### Step 2: Admin User Interaction (PricingForm Component)

**Location**: `components/PricingForms.tsx`

1. User selects pricing model: `"one_time"` or `"subscription"`
2. User selects price basis: `"flat"` or `"per_unit"`
3. Form dynamically shows relevant fields:
   - **Flat**: `basePrice` input
   - **Per-unit**: `unitName`, `tierType`, `tiers` editor
   - **Subscription**: `interval`, `intervalCount`
   - **One-time + Flat**: Installments options

4. Changes trigger `onChange` callback → updates `pricing` state

### Step 3: Client-Side Preview

**Function**: `computePrice(pricing, quantity)` in `components/PricingForms.tsx`

Calculates:
- Subtotal (before discount)
- Discount amount
- Net (after discount)
- VAT (if not tax inclusive)
- Total

**Display**: `PricePreviewCard` component shows live preview

### Step 4: Validation Before Submit

**Function**: `validatePricing()` in `app/dashboard/products/new/page.tsx`

Validates:
- **Flat pricing**: `basePrice >= 0`
- **Per-unit pricing**: `tierType` exists, `tiers.length > 0`, `minQty <= maxQty`
- **Subscription**: `interval` and `intervalCount` required
- **Installments**: Only for `one_time` model

### Step 5: Normalization

**Function**: `normalizePricingForApi(pricing)` in `lib/constants/pricing.ts`

Cleans up pricing object:
- Removes installments for subscriptions
- Removes `priceBasis`-incompatible fields:
  - If `flat`: removes `unitName`, `tierType`, `tiers`
  - If `per_unit`: removes `basePrice` if empty
- Ensures required fields are present
- Validates installments structure

### Step 6: API Submission

**Location**: `app/dashboard/products/new/page.tsx` → `handleSubmit()`

```typescript
const normalizedPricing = normalizePricingForApi(pricing);

const payload = {
  // ... other product fields ...
  pricing: normalizedPricing,
  discountPercentage: rootDiscountPercentage,  // Also at root level
};

await postApiRequest("/api/products", token, payload);
```

**Endpoint**: `POST /api/products`

---

## 4. Editing an Existing Product (Admin Flow)

### Step 1: Fetch Product Data (Admin Only)

**Location**: `app/dashboard/products/[id]/edit/page.tsx`  
**Access**: Admin dashboard only

```typescript
const response = await getApiRequest(`/api/products/${params.id}`, token);
const product = response.data.data;
```

### Step 2: Data Mapping & Migration

**Location**: `app/dashboard/products/[id]/edit/page.tsx` → `useEffect`

**Handles legacy format** (if API returns old structure):
- Old: `model: "per_unit"` → New: `model: "one_time"`, `priceBasis: "per_unit"`
- Maps `discountPercent` → `discountPercentage`
- Infers `priceBasis` from presence of `tiers`

```typescript
const pricingData = product.pricing || {};

// Detect and migrate old format
if (pricingData.model === "per_unit") {
  model = "one_time";
  priceBasis = "per_unit";
} else if (pricingData.priceBasis) {
  priceBasis = pricingData.priceBasis;
}

// Build complete Pricing object
const mappedPricing: Pricing = {
  model,
  priceBasis,
  currency: pricingData.currency || "gbp",
  // ... map all fields ...
};

setPricing(mappedPricing);
```

### Step 3: User Edits (Same as Create Flow)

Uses same `PricingForm` component with current pricing as `value`

### Step 4: Update Submission

**Location**: `app/dashboard/products/[id]/edit/page.tsx` → `handleSubmit()`

```typescript
// Update product root data
const rootPayload = { /* product fields */ };

// Update pricing separately
const pricingPayload = normalizePricingForApi(pricing);

await Promise.all([
  updateApiRequest(`/api/products/${params.id}`, token, rootPayload),
  patchApiRequest(`/api/products/${params.id}/pricing`, token, pricingPayload),
]);
```

**Endpoints**:
- `PUT /api/products/[id]` - Update product root
- `PATCH /api/products/[id]/pricing` - Update pricing

---

## 5. Displaying Products in Admin Dashboard

### Admin Product List Page (`app/dashboard/products/page.tsx`)

**Access**: Admin dashboard only  
**Fetch**: `GET /api/products/public?page=1&limit=10`

**Display Functions** (from `utils/pricingDisplay.ts`):
- `getPriceLabel(product)` - Main price display
- `getDiscountedPriceLabel(product)` - Price with discount applied
- `getDiscountPercent(product)` - Discount percentage
- `formatMoneySafe(amount, currency)` - Formats currency (shows "Free" for 0)

**Display Logic**:
```typescript
// Shows original price with strikethrough if discounted
{getDiscountPercent(product) > 0 ? (
  <>
    <span className="line-through">{getPriceLabel(product)}</span>
    <span>{getDiscountedPriceLabel(product)}</span>
  </>
) : (
  getPriceLabel(product)
)}

// Shows pricing breakdown info
{product.pricing.priceBasis === "per_unit" ? (
  <span>{product.pricing.tierType} tiers • per {product.pricing.unitName}</span>
) : null}
```

### Admin Product Detail Page (`app/dashboard/products/[id]/page.tsx`)

**Access**: Admin dashboard only  
**Fetch**: `GET /api/products/public/[id]`

**Display**: Shows full pricing breakdown card with:
- Model and price basis
- Currency
- Tier information (if per-unit)
- Discount (if applicable)
- Interval (if subscription)

---

## 6. Pricing Display Utilities (`utils/pricingDisplay.ts`)

### `formatMoneySafe(amount, currency)`
- Formats amount as currency
- Returns `"Free"` when amount is `0`
- Falls back to currency symbol if formatting fails

### `getPriceLabel(input)`
Generates human-readable price string:
- **Subscription**: `"£99 / month"` or `"Free"` (if 0)
- **Per-unit tiered**: `"£400 - £700 per team"` or `"Free"` (if all 0)
- **Per-unit flat**: `"£50 per person"` or `"Free"` (if 0)
- **One-time flat**: `"£299"` or `"Free"` (if 0)

### `getDiscountedPriceLabel(input)`
- Calculates discounted price
- Applies discount percentage
- Returns formatted price or `"Free"`

### `getPrimaryPrice(input)`
- Returns numeric price for sorting/comparison
- For tiered: returns minimum tier price
- For flat: returns `basePrice`

### `getSortablePrice(input)`
- Used for sorting products by price
- Returns numeric value for comparison

---

## 7. Validation Flow (`utils/pricingApi.ts`)

### `validatePricing(pricing)`
Returns error message string or `null` if valid.

**Checks**:
1. **Flat pricing**:
   - `basePrice >= 0`
   - Subscription requires `interval` and `intervalCount >= 1`

2. **Per-unit pricing**:
   - `tierType` must exist
   - `tiers.length > 0`
   - `minQty >= 1`
   - `maxQty >= minQty`
   - Subscription per-unit also requires `interval`

### `pickPricingForApi(p)`
Constructs clean payload with only relevant fields:
- Base fields (model, priceBasis, currency, etc.)
- Fields based on `priceBasis` (flat vs per_unit)
- Subscription fields if `model === "subscription"`
- Installments if `model === "one_time" && allowInstallments === true`

---

## 8. Normalization Flow (`lib/constants/pricing.ts`)

### `normalizePricingForApi(p)`
Cleans and prepares pricing for API:

1. **Subscription handling**:
   - Removes `allowInstallments` and `installments`

2. **Installments handling**:
   - If `allowInstallments === false` or no `installments`: removes both
   - If enabled: validates and ensures all required fields

3. **Price basis cleanup**:
   - **If `priceBasis === "flat"`**:
     - Deletes: `unitName`, `tierType`, `tiers`
   - **If `priceBasis === "per_unit"`**:
     - Deletes `basePrice` if empty/undefined
     - Ensures `tierType` defaults to `"volume"` if missing
     - Ensures `tiers` is array if missing

4. Returns cleaned `Pricing` object

---

## 9. Free Pricing Special Case

**Rule**: Products with `basePrice = 0` display as `"Free"`

**Implementation**:
- `formatMoneySafe(0, currency)` → returns `"Free"`
- `formatMoney(0, currency)` → returns `"Free"`
- All price labels check for `"Free"` and avoid adding suffixes:
  - No "per unit" suffix
  - No interval suffix for subscriptions

---

## 10. Summary Flow Diagram

```
┌─────────────────┐
│  API Response   │ (product.pricing)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Mapping   │ (edit page: handles legacy format)
│  & Migration    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Form State     │ (useState<Pricing>)
│  (PricingForm)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│  User Input     │────▶│  Preview     │ (computePrice)
│  onChange       │     │  Calculation │
└────────┬────────┘     └──────────────┘
         │
         ▼
┌─────────────────┐
│  Validation     │ (validatePricing)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Normalization  │ (normalizePricingForApi)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Request    │ (POST/PATCH with pricing payload)
└─────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Display        │────▶│  Price Labels   │ (getPriceLabel)
│  Components     │     │  & Formatting   │ (formatMoneySafe)
└─────────────────┘     └──────────────────┘
```

---

## Key Files & Functions (Admin Dashboard)

| File | Purpose | Key Functions |
|------|---------|---------------|
| `lib/constants/pricing.ts` | Type definitions & defaults | `Pricing`, `defaultPricing`, `normalizePricingForApi` |
| `components/PricingForms.tsx` | Pricing form UI component | `PricingForm`, `computePrice`, `formatMoney` |
| `utils/pricingDisplay.ts` | Display & formatting utilities | `getPriceLabel`, `formatMoneySafe`, `getDiscountedPriceLabel` |
| `utils/pricingApi.ts` | Validation & API helpers | `validatePricing`, `pickPricingForApi` |
| `app/dashboard/products/new/page.tsx` | Create product page | Pricing state management, submission |
| `app/dashboard/products/[id]/edit/page.tsx` | Edit product page | Data mapping, migration, updates |
| `app/dashboard/products/page.tsx` | Product list page | Displays pricing in table |
| `app/dashboard/products/[id]/page.tsx` | Product detail page | Shows full pricing breakdown |

---

## Important Notes

1. **Legacy Support**: Edit page handles migration from old `model: "per_unit"` format
2. **Free Pricing**: All price displays show "Free" when value is 0
3. **Separate Endpoints**: Product root and pricing are updated via separate API endpoints
4. **Price Basis**: `priceBasis` determines which fields are required/valid
5. **Installments**: Only available for `one_time` model (not subscriptions)
6. **Tier Types**: Only `"volume"` and `"stairstep"` are supported (no "none" or "graduated")

