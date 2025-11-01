/*************************
 * Types & Constants
 *************************/
export type Currency =
  | "usd"
  | "eur"
  | "gbp"
  | "cad"
  | "aud"
  | "jpy"
  | "inr"
  | "ngn";
export type PriceModel = "one_time" | "subscription" | "free";
export type PriceBasis = "flat" | "per_unit";
export type Interval = "day" | "week" | "month" | "year";
export type TierType = "volume" | "stairstep";
export type DownPaymentType = "percent" | "amount";
export type UnitType = "team" | "person";

export interface Tier {
  upTo: number; // cap for this band
  unitPrice: number; // volume: per-unit price; stairstep: flat band total
}

export interface InstallmentsConfig {
  enabled: true; // installments are only meaningful when enabled
  count: number;
  interval: Interval;
  intervalCount: number;
  downPaymentType: DownPaymentType;
  downPaymentValue: number;
  allowEarlyPayoff?: boolean;
  provider?: "in_house" | string;
}

export interface Pricing {
  model: PriceModel;
  priceBasis: PriceBasis;
  currency: string;

  // flat only
  basePrice?: number; // required if priceBasis === "flat"

  // per_unit only (tiers required)
  unitName?: "person" | "team";
  tierType?: TierType; // required if priceBasis === "per_unit"
  tiers?: Tier[]; // sorted ascending

  // quantity constraints (cart sends actual quantity)
  minQty?: number;
  maxQty?: number;

  // tax/discount flags (outer layers will use these)
  taxInclusive?: boolean;
  vatPercentage?: number;
  discountPercentage?: number;

  // cadence (required if subscription)
  interval?: Interval;
  intervalCount?: number;

  // subscription-specific fields
  subscriptionPrice?: number; // subscription price (if using separate field from basePrice)
  trialDays?: number; // number of trial days (default: 0)
  setupFee?: number; // one-time setup fee (default: 0)
  autoRenew?: boolean; // whether subscription auto-renews (default: true)
  minTermMonths?: number; // minimum term in months (default: 0)
  proration?: boolean; // whether to prorate changes (default: true)

  // installment availability (only for one_time)
  allowInstallments?: boolean; // default false
  installments?: InstallmentsConfig; // only used if allowInstallments===true
}

export interface PriceBreakdown {
  model: PriceModel;
  quantity: number;
  unitPrice?: number; // for per-unit (volume) or one-time reference
  subtotal: number; // before discount & tax
  discount?: number; // discount amount
  net?: number; // after discount, before tax
  vat?: number;
  setupFee?: number; // setup fee for subscriptions
  total: number;
  interval?: Interval;
  intervalCount?: number;
  tierType?: TierType;
}

export const currencySymbols: Record<Currency, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
  cad: "C$",
  aud: "A$",
  jpy: "¥",
  inr: "₹",
  ngn: "₦",
};

/*************************
 * PricingForm (controlled)
 *************************/
export interface PricingFormProps {
  value: Pricing;
  onChange: (next: Pricing) => void;
  disabled?: boolean;
  showPreview?: boolean; // default true
}

export const defaultPricing: Pricing = {
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
  // subscription defaults
  trialDays: 0,
  setupFee: 0,
  autoRenew: true,
  minTermMonths: 0,
  proration: true,
};

export function normalizePricingForApi(p: Pricing): Pricing {
  const out: Pricing = { ...p };

  // Free model: only keep model and currency
  if (out.model === "free") {
    return {
      model: "free",
      priceBasis: "flat", // Required by interface but won't be sent to API
      currency: out.currency,
    } as Pricing;
  }

  // Never send installments for subscriptions
  if (out.model === "subscription") {
    delete out.allowInstallments;
    delete out.installments;
  } else {
    // Only send installments if allowInstallments is true and installments is configured
    if (!out.allowInstallments || !out.installments) {
      delete out.allowInstallments;
      delete out.installments;
    } else {
      // Ensure installments has required fields
      out.installments = {
        enabled: true,
        count: Math.max(2, Number(out.installments.count || 2)),
        interval: out.installments.interval || "month",
        intervalCount: out.installments.intervalCount || 1,
        downPaymentType: out.installments.downPaymentType,
        downPaymentValue: Math.max(
          0,
          Number(out.installments.downPaymentValue || 0)
        ),
        allowEarlyPayoff: out.installments.allowEarlyPayoff,
        provider: out.installments.provider || "in_house",
      };
      // DO NOT include allowInstallments - backend rejects it when installments is present
      delete out.allowInstallments;
    }
  }

  // Clean up fields based on priceBasis
  if (out.priceBasis === "flat") {
    // Remove per_unit specific fields
    delete out.unitName;
    delete out.tierType;
    delete out.tiers;
  } else if (out.priceBasis === "per_unit") {
    // Remove flat-specific basePrice if empty
    if (!out.basePrice) {
      delete out.basePrice;
    }
    // Ensure tierType and tiers are present
    if (!out.tierType) {
      out.tierType = "volume";
    }
    if (!out.tiers) {
      out.tiers = [];
    }
  }

  return out;
}
