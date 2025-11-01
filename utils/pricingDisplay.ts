import { getCurrencySymbol } from "@/lib/constants/currencies";
import { Currency, Pricing } from "@/lib/constants/pricing";

/** Accept either a Pricing-ish object OR any object that may contain `pricing` and/or root price fields. */
export type WithPricing =
  | Partial<Pricing>
  | (object & {
      pricing?: Partial<Pricing> | null;
      discountPercentage?: number;
      currency?: string; // server may send uppercase/lowercase
      price?: number; // legacy root price
    });

function hasModel(x: unknown): x is Partial<Pricing> {
  return !!x && typeof x === "object" && "model" in (x as any);
}
function hasPricing(x: unknown): x is { pricing?: Partial<Pricing> } {
  return !!x && typeof x === "object" && "pricing" in (x as any);
}

/** Build a minimal Pricing shape from legacy root fields if present. */
function fallbackFromRoot(input: any): Partial<Pricing> {
  const hasRootBits = input && (input.price != null || input.currency != null);
  if (!hasRootBits) return {};
  const cur = String(input.currency ?? "gbp").toLowerCase() as Currency;
  const price = Number(input.price ?? 0);
  // Treat legacy root price as a one-time price
  return { model: "one_time", currency: cur, basePrice: price };
}

function asPricing(input: WithPricing): Partial<Pricing> {
  if (hasModel(input)) return input;
  if (hasPricing(input)) return input.pricing ?? {};
  return fallbackFromRoot(input);
}

export function inferCurrency(
  input: WithPricing,
  fallback: Currency = "gbp"
): Currency {
  const p = asPricing(input);
  const rootCur = (input as any)?.currency as string | undefined;
  const code = (p.currency ?? rootCur ?? fallback) as Currency;
  return code;
}

export function formatMoneySafe(amount: unknown, currency?: Currency): string {
  const n = Number(amount ?? 0);
  // Show "Free" when price is 0
  if (n === 0) return "Free";
  
  const safeCode = (currency ?? "gbp") as Currency;
  const iso = safeCode.toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: iso,
    }).format(n);
  } catch {
    return `${getCurrencySymbol(safeCode)}${n.toLocaleString()}`;
  }
}

export function isTiered(p: Partial<Pricing>): boolean {
  return p.priceBasis === "per_unit" && (p.tierType === "volume" || p.tierType === "stairstep");
}

export function getPrimaryPrice(input: WithPricing): number {
  const p = asPricing(input);
  if (p.priceBasis === "flat") {
    // Flat pricing for both one_time and subscription
    return Number(p.basePrice || 0);
  }
  if (p.priceBasis === "per_unit") {
    if (isTiered(p)) {
      const tiers = (p.tiers || []).slice().sort((a, b) => a.upTo - b.upTo);
      return Number(tiers[0]?.unitPrice || 0);
    }
    return Number(p.basePrice || 0);
  }
  // Fallback
  if (p.basePrice != null) return Number(p.basePrice || 0);
  // final fallback to root price if we never built pricing
  return Number((input as any).price || 0);
}

/** Human label for a price (uses pricing when present, otherwise falls back to root price/currency). */
export function getPriceLabel(input: WithPricing): string {
  const p = asPricing(input);
  const cur = inferCurrency(input);

  if (p.model === "subscription") {
    const cost = formatMoneySafe(p.basePrice || 0, cur);
    // If cost is "Free", just show "Free"
    if (cost === "Free") return "Free";
    const ic = p.intervalCount ?? 1;
    const interval = p.interval ?? "month";
    return `${cost} / ${ic} ${interval}${ic > 1 ? "s" : ""}`;
  }

  if (p.priceBasis === "per_unit") {
    if (isTiered(p)) {
      // Show tier range (e.g., "£400 - £700 per team")
      const tiers = (p.tiers || []).slice().sort((a, b) => a.unitPrice - b.unitPrice);
      if (tiers.length === 0) return "Tiered pricing";
      const minPrice = tiers[0]?.unitPrice || 0;
      const maxPrice = tiers[tiers.length - 1]?.unitPrice || 0;
      const unit = p.unitName || "team";
      
      // If all tiers are free, just show "Free"
      if (minPrice === 0 && maxPrice === 0) {
        return "Free";
      }
      
      if (minPrice === maxPrice) {
        return `${formatMoneySafe(minPrice, cur)} per ${unit}`;
      }
      return `${formatMoneySafe(minPrice, cur)} - ${formatMoneySafe(maxPrice, cur)} per ${unit}`;
    }
    const cost = formatMoneySafe(p.basePrice || 0, cur);
    const unit = p.unitName || "team";
    // If cost is "Free", don't add "per unit"
    if (cost === "Free") return "Free";
    return `${cost} per ${unit}`;
  }

  // one_time flat or unknown -> show amount only
  const amount = p.basePrice != null ? p.basePrice : (input as any).price ?? 0;
  return formatMoneySafe(amount, cur);
}

/** Get discount percentage from pricing or root level. */
export function getDiscountPercent(input: WithPricing): number {
  const p = asPricing(input);
  const root = (input as any).discountPercentage;
  const internal = p.discountPercentage;
  const val = root ?? internal ?? 0;
  const num = Number(val);
  return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0;
}

export function getDiscountedPriceLabel(input: WithPricing): string {
  const p = asPricing(input);
  const pct = getDiscountPercent(input);
  if (!pct || pct <= 0) return getPriceLabel(input);

  const cur = inferCurrency(input);
  const apply = (amount: number) => amount * (1 - pct / 100);

  if (p.model === "subscription") {
    const base = Number(p.basePrice || 0);
    const discounted = apply(base);
    const cost = formatMoneySafe(discounted, cur);
    // If cost is "Free", just show "Free"
    if (cost === "Free") return "Free";
    const ic = p.intervalCount ?? 1;
    const interval = p.interval ?? "month";
    return `${cost} / ${ic} ${interval}${ic > 1 ? "s" : ""}`;
  }

  if (p.priceBasis === "per_unit") {
    if (isTiered(p)) return getPriceLabel(input); // ambiguous for tiered
    const base = Number(p.basePrice || 0);
    const discounted = apply(base);
    const cost = formatMoneySafe(discounted, cur);
    const unit = p.unitName || "team";
    // If cost is "Free", don't add "per unit"
    if (cost === "Free") return "Free";
    return `${cost} per ${unit}`;
  }

  // one_time flat or fallback
  const base =
    p.basePrice != null
      ? Number(p.basePrice || 0)
      : Number((input as any).price || 0);
  return formatMoneySafe(apply(base), cur);
}

/** Numeric value suitable for sorting by "price". */
export function getSortablePrice(input: WithPricing): number {
  const p = asPricing(input);
  if (p.priceBasis === "per_unit" && isTiered(p)) {
    // For tiered pricing, use the minimum tier price for sorting
    const tiers = (p.tiers || []).slice().sort((a, b) => a.unitPrice - b.unitPrice);
    return Number(tiers[0]?.unitPrice || 0);
  }
  return getPrimaryPrice(input);
}
