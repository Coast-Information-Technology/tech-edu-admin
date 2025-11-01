// src/utils/pricingApi.ts  (aka "@/utils/pricingApi")
import { Pricing } from "@/lib/constants/pricing";

export const validatePricing = (pricing: Pricing): string | null => {
  // Validate flat pricing
  if (pricing.priceBasis === "flat") {
    if ((pricing.basePrice ?? 0) < 0)
      return "Price cannot be negative.";
    
    // Subscription requires interval
    if (pricing.model === "subscription") {
      if (!pricing.interval) return "Subscription interval is required.";
      if ((pricing.intervalCount ?? 1) < 1)
        return "Subscription interval count must be at least 1.";
    }
  }
  
  // Validate per_unit pricing
  if (pricing.priceBasis === "per_unit") {
    if (!pricing.tierType) return "Tier type is required for per-unit pricing.";
    if (!pricing.tiers || pricing.tiers.length === 0)
      return "Please add at least one tier for per-unit pricing.";
    if ((pricing.minQty ?? 1) < 1)
      return "Minimum quantity must be at least 1.";
    if ((pricing.maxQty ?? 1) < (pricing.minQty ?? 1))
      return "Max quantity must be >= min quantity.";
    
    // Subscription per_unit also requires interval
    if (pricing.model === "subscription") {
      if (!pricing.interval) return "Subscription interval is required.";
      if ((pricing.intervalCount ?? 1) < 1)
        return "Subscription interval count must be at least 1.";
    }
  }
  
  return null;
};

export const pickPricingForApi = (p: Pricing) => {
  const base = {
    model: p.model,
    priceBasis: p.priceBasis,
    currency: p.currency,
    taxInclusive: p.taxInclusive,
    vatPercentage: p.vatPercentage,
    discountPercentage: p.discountPercentage,
    minQty: p.minQty,
    maxQty: p.maxQty,
  };
  
  // Add fields based on priceBasis
  if (p.priceBasis === "flat") {
    return {
      ...base,
      basePrice: p.basePrice,
    };
  }
  
  if (p.priceBasis === "per_unit") {
    return {
      ...base,
      unitName: p.unitName,
      tierType: p.tierType,
      tiers: p.tiers,
    };
  }
  
  // Add subscription-specific fields if applicable
  if (p.model === "subscription") {
    return {
      ...base,
      interval: p.interval,
      intervalCount: p.intervalCount,
    };
  }
  
  // Add installments for one_time
  if (p.model === "one_time" && p.allowInstallments && p.installments) {
    return {
      ...base,
      allowInstallments: true,
      installments: {
        enabled: true,
        count: p.installments.count,
        interval: p.installments.interval,
        intervalCount: p.installments.intervalCount,
        downPaymentType: p.installments.downPaymentType,
        downPaymentValue: p.installments.downPaymentValue,
        allowEarlyPayoff: p.installments.allowEarlyPayoff,
        provider: p.installments.provider || "in_house",
      },
    };
  }
  
  return base;
};
