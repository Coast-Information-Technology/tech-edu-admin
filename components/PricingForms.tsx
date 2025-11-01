"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import {
  Currency,
  currencySymbols,
  defaultPricing,
  DownPaymentType,
  InstallmentsConfig,
  Interval,
  PriceBreakdown,
  PriceBasis,
  PriceModel,
  Pricing,
  Tier,
  TierType,
  UnitType,
} from "@/lib/constants/pricing";

/*************************
 * Money & Helpers
 *************************/
const toCents = (n: number) => Math.round((Number(n) || 0) * 100);
const fromCents = (c: number) => c / 100;
const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));
const pct = (baseC: number, p: number) =>
  Math.round((baseC * (Number(p) || 0)) / 100);

export function formatMoney(amount: number, currency: Currency) {
  // Show "Free" when price is 0
  if (amount === 0) return "Free";
  
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currencySymbols[currency]}${Number(amount).toLocaleString()}`;
  }
}

/*************************
 * Installments calculator
 *************************/
export function computeInstallments(total: number, cfg?: InstallmentsConfig) {
  if (!cfg?.enabled) return null;

  // N = number of installments AFTER down payment. Backend minimum is 2.
  const count = Math.max(2, Number(cfg.count || 0));

  const totalC = toCents(total);
  const rawDownC =
    cfg.downPaymentType === "percent"
      ? pct(totalC, clamp(cfg.downPaymentValue ?? 0, 0, 100))
      : toCents(cfg.downPaymentValue ?? 0);

  const downC = Math.min(Math.max(0, rawDownC), totalC);
  const remainderC = Math.max(0, totalC - downC);

  const each = Math.floor(remainderC / count);
  const planC = Array.from({ length: count }, () => each);
  planC[planC.length - 1] += remainderC - each * count;

  return {
    downPayment: fromCents(downC),
    plan: planC.map(fromCents),
  };
}

/*************************
 * Price computation (client-side preview)
 *************************/
export function computePrice(pricing: Pricing, quantity = 1): PriceBreakdown {
  // Handle free model
  if (pricing.model === "free") {
    return {
      model: "free",
      quantity: 1,
      subtotal: 0,
      discount: 0,
      net: 0,
      total: 0,
    };
  }

  const taxInclusive = pricing.taxInclusive ?? false;
  const vatPct = pricing.vatPercentage ?? 0;
  const discountPct = clamp(pricing.discountPercentage ?? 0, 0, 100);
  const hasVat = vatPct > 0;

  // Handle flat pricing (one_time or subscription with flat basis)
  if (pricing.priceBasis === "flat") {
    if (pricing.model === "one_time") {
      const subtotalC = toCents(pricing.basePrice ?? 0);
      const discountC = pct(subtotalC, discountPct);
      const netC = subtotalC - discountC;
      // Only calculate VAT if VAT percentage is set and tax is not inclusive
      const vatC = hasVat && !taxInclusive ? pct(netC, vatPct) : 0;
      const totalC = netC + vatC;

      return {
        model: "one_time",
        quantity: 1,
        unitPrice: fromCents(subtotalC),
        subtotal: fromCents(subtotalC),
        discount: fromCents(discountC),
        net: fromCents(netC),
        vat: hasVat && !taxInclusive ? fromCents(vatC) : undefined,
        total: fromCents(totalC),
      };
    }

    if (pricing.model === "subscription") {
      const priceC = toCents(pricing.basePrice ?? 0);
      const setupFeeC = toCents(pricing.setupFee ?? 0);
      const subtotalC = priceC;
      const discountC = pct(subtotalC, discountPct);
      const netC = subtotalC - discountC;
      // Only calculate VAT if VAT percentage is set and tax is not inclusive
      const vatC = hasVat && !taxInclusive ? pct(netC, vatPct) : 0;
      // Setup fee is added to total, but typically not subject to discount/VAT (depends on business logic)
      // Here we add it after VAT for "due now" calculation
      const totalC = netC + vatC + setupFeeC;

      return {
        model: "subscription",
        quantity: 1,
        unitPrice: fromCents(priceC),
        interval: pricing.interval || "month",
        intervalCount: pricing.intervalCount || 1,
        subtotal: fromCents(subtotalC),
        discount: fromCents(discountC),
        net: fromCents(netC),
        vat: hasVat && !taxInclusive ? fromCents(vatC) : undefined,
        setupFee: fromCents(setupFeeC),
        total: fromCents(totalC),
      };
    }
  }

  // Handle per_unit pricing (one_time or subscription with per_unit basis)
  if (pricing.priceBasis === "per_unit") {
    const qMin = Math.max(pricing.minQty ?? 1, 1);
    const qMax = Math.max(pricing.maxQty ?? 1000, qMin);
    const q = clamp(quantity || qMin, qMin, qMax);
    const tierType: TierType = pricing.tierType || "volume";
    const tiers = (pricing.tiers || []).slice().sort((a, b) => a.upTo - b.upTo);

    if (tiers.length === 0) {
      return {
        model: pricing.model,
        quantity: q,
        subtotal: 0,
        discount: 0,
        net: 0,
        vat: undefined,
        total: 0,
        tierType,
      };
    }

  if (tierType === "volume") {
      // Volume: per-unit pricing within each tier
    let idx = tiers.findIndex((t) => q <= t.upTo);
    if (idx === -1) idx = tiers.length - 1;

    const t = tiers[idx];
    const isLast = idx === tiers.length - 1;
    const effectiveQty = isLast ? q : t.upTo;

      const unitC = toCents(t.unitPrice);
      const bandFlatC = unitC * effectiveQty;
      const discountC = pct(bandFlatC, discountPct);
      const netC = bandFlatC - discountC;
      // Only calculate VAT if VAT percentage is set and tax is not inclusive
      const vatC = hasVat && !taxInclusive ? pct(netC, vatPct) : 0;
      const totalC = netC + vatC;

      return {
        model: pricing.model,
        quantity: q,
        unitPrice: fromCents(unitC),
        subtotal: fromCents(bandFlatC),
        discount: fromCents(discountC),
        net: fromCents(netC),
        vat: hasVat && !taxInclusive ? fromCents(vatC) : undefined,
        total: fromCents(totalC),
        tierType,
        interval: pricing.interval,
        intervalCount: pricing.intervalCount,
      };
    }

    if (tierType === "stairstep") {
      // Stairstep: flat tier price for the hit band
      let idx = tiers.findIndex((t) => q <= t.upTo);
      if (idx === -1) idx = tiers.length - 1;
      const t = tiers[idx];
      const flatC = toCents(t.unitPrice);
      const discountC = pct(flatC, discountPct);
      const netC = flatC - discountC;
      // Only calculate VAT if VAT percentage is set and tax is not inclusive
      const vatC = hasVat && !taxInclusive ? pct(netC, vatPct) : 0;
      const totalC = netC + vatC;

      return {
        model: pricing.model,
        quantity: q,
        subtotal: fromCents(flatC),
        discount: fromCents(discountC),
        net: fromCents(netC),
        vat: hasVat && !taxInclusive ? fromCents(vatC) : undefined,
        total: fromCents(totalC),
        tierType,
        interval: pricing.interval,
        intervalCount: pricing.intervalCount,
      };
    }
  }

  // Fallback
  return {
    model: pricing.model,
    quantity: 1,
    subtotal: 0,
    discount: 0,
    net: 0,
    vat: undefined,
    total: 0,
  };
}

/*************************
 * TierEditor
 *************************/
export interface TierEditorProps {
  tierType: TierType;
  tiers: Tier[];
  onChange: (tiers: Tier[]) => void;
  disabled?: boolean;
}

export function normalizePricingForApi(p: Pricing): Pricing {
  const out: Pricing = { ...p };

  if (out.model === "subscription") {
    delete out.installments;
    delete out.allowInstallments;
    return out;
  }

  if (!out.installments?.enabled) {
    delete out.installments;
  } else {
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
  }

  return out;
}

export function TierEditor({
  tierType,
  tiers,
  onChange,
  disabled,
}: TierEditorProps) {
  // tierType is required and cannot be "none" in the new structure

  const sorted = useMemo(
    () => (tiers || []).slice().sort((a, b) => a.upTo - b.upTo),
    [tiers]
  );

  const addRow = () => {
    const upTo =
      sorted.length > 0 ? Math.max(...sorted.map((t) => t.upTo)) + 1 : 10;
    const next = [...sorted, { upTo, unitPrice: 0 }];
    onChange(next);
  };

  const removeRow = (idx: number) => {
    const next = sorted.filter((_, i) => i !== idx);
    onChange(next);
  };

  const updateCell = (idx: number, key: keyof Tier, value: number) => {
    const next = sorted.map((row, i) =>
      i === idx ? { ...row, [key]: value } : row
    );
    onChange(next);
  };

  const priceColumnLabel =
    tierType === "stairstep" ? "Flat price (band)" : "Unit price";

  return (
    <Card className="border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Tier Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Up to (qty)</TableHead>
                <TableHead className="w-[160px]">{priceColumnLabel}</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={row.upTo}
                      disabled={disabled}
                      onChange={(e) =>
                        updateCell(idx, "upTo", Number(e.target.value || 0))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={row.unitPrice}
                      disabled={disabled}
                      onChange={(e) =>
                        updateCell(
                          idx,
                          "unitPrice",
                          Number(e.target.value || 0)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(idx)}
                      disabled={disabled}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3">
          <Button
            type="button"
            onClick={addRow}
            disabled={disabled}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add tier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/*************************
 * PricePreviewCard
 *************************/
export interface PricePreviewCardProps {
  pricing: Pricing;
  quantity?: number;
}

export function PricePreviewCard({
  pricing,
  quantity = 1,
}: PricePreviewCardProps) {
  const breakdown = useMemo(
    () => computePrice(pricing, quantity),
    [pricing, quantity]
  );
  const label = pricing.unitName || "team";
  const money = (n: number) => {
    // Ensure currency is a valid Currency type
    const validCurrency: Currency = (["usd", "eur", "gbp", "cad", "aud", "jpy", "inr", "ngn"].includes(pricing.currency.toLowerCase()) 
      ? pricing.currency.toLowerCase() 
      : "gbp") as Currency;
    return formatMoney(n, validCurrency);
  };

  // Band summaries for tiered modes
  const tiersSorted = (pricing.tiers || [])
    .slice()
    .sort((a, b) => a.upTo - b.upTo);

  // Stairstep band summary
  let stairstepBand: {
    idx: number;
    min: number;
    max: number | null;
    flat: number;
  } | null = null;
  if (
    pricing.priceBasis === "per_unit" &&
    pricing.tierType === "stairstep" &&
    tiersSorted.length
  ) {
    let idx = tiersSorted.findIndex((t) => quantity <= t.upTo);
    if (idx === -1) idx = tiersSorted.length - 1;
    const t = tiersSorted[idx];
    const min = idx === 0 ? 1 : tiersSorted[idx - 1].upTo + 1;
    const max = idx === tiersSorted.length - 1 ? null : t.upTo;
    stairstepBand = { idx, min, max, flat: t.unitPrice };
  }

  // Volume band summary (with new band-flat rule)
  let volumeBand: {
    idx: number;
    min: number;
    max: number | null;
    unit: number;
    effectiveQty: number;
  } | null = null;
  if (
    pricing.priceBasis === "per_unit" &&
    pricing.tierType === "volume" &&
    tiersSorted.length
  ) {
    let idx = tiersSorted.findIndex((t) => quantity <= t.upTo);
    if (idx === -1) idx = tiersSorted.length - 1;
    const t = tiersSorted[idx];
    const isLast = idx === tiersSorted.length - 1;
    const min = idx === 0 ? 1 : tiersSorted[idx - 1].upTo + 1;
    const max = isLast ? null : t.upTo;
    volumeBand = {
      idx,
      min,
      max,
      unit: t.unitPrice,
      effectiveQty: isLast ? quantity : t.upTo, // mirrors computePrice
    };
  }

  return (
    <Card className="border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Price Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {pricing.model === "subscription" && pricing.priceBasis === "flat" ? (
          <div className="space-y-1">
            <div>
              <span className="font-medium">Recurring:</span>{" "}
              {money(Number((pricing.basePrice ?? 0)))} /{" "}
              {pricing.intervalCount || 1} {pricing.interval || "month"}
            </div>
            {(pricing.trialDays ?? 0) > 0 && (
              <div className="text-xs text-muted-foreground">
                {pricing.trialDays} day{pricing.trialDays !== 1 ? "s" : ""} free trial
              </div>
            )}
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{money(breakdown.subtotal)}</span>
              </div>
              {typeof breakdown.discount === "number" &&
                breakdown.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Discount ({pricing.discountPercentage ?? 0}%)</span>
                    <span>-{money(breakdown.discount)}</span>
                  </div>
                )}
              {typeof breakdown.net === "number" && (
                <div className="flex items-center justify-between">
                  <span>Net</span>
                  <span>{money(breakdown.net)}</span>
                </div>
              )}
              {typeof breakdown.setupFee === "number" &&
                breakdown.setupFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Setup Fee</span>
                    <span>{money(breakdown.setupFee)}</span>
                  </div>
                )}
              {(pricing.vatPercentage ?? 0) > 0 && (
                breakdown.vat && breakdown.vat > 0 ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span>VAT ({pricing.vatPercentage ?? 0}%)</span>
                      <span>{money(breakdown.vat)}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Calc: {money(breakdown.net || 0)} × {pricing.vatPercentage ?? 0}% = {money(breakdown.vat)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                      <span>VAT ({pricing.vatPercentage ?? 0}%) included in price</span>
                      {(() => {
                        const rate = pricing.vatPercentage ?? 0;
                        const base = Math.max(0, (breakdown.total || 0) - (breakdown.setupFee || 0));
                        const included = base * rate / (100 + rate);
                        return <span>{money(included)}</span>;
                      })()}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {(() => {
                        const rate = pricing.vatPercentage ?? 0;
                        const base = Math.max(0, (breakdown.total || 0) - (breakdown.setupFee || 0));
                        const included = base * rate / (100 + rate);
                        return (
                          <>
                            Calc: {money(base)} × {rate}% ÷ (100% + {rate}%) = {money(included)}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )
              )}
              <div className="flex items-center justify-between font-semibold border-t pt-2 mt-1">
                <span>Total due now</span>
                <span>{money(breakdown.total)}</span>
              </div>
            </div>
            {(pricing.minTermMonths ?? 0) > 0 && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Minimum term: {pricing.minTermMonths} month
                {pricing.minTermMonths !== 1 ? "s" : ""}
              </div>
            )}
            <div className="text-xs text-muted-foreground space-y-1">
              {pricing.autoRenew !== false && (
                <div>✓ Auto-renewal enabled</div>
              )}
              {pricing.proration !== false && (
                <div>✓ Proration enabled</div>
              )}
            </div>
          </div>
        ) : pricing.priceBasis === "per_unit" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium capitalize">Per {label}</span>
              <span className="text-muted-foreground">tiered</span>
            </div>

            {/* Volume band summary (new rule) */}
            {pricing.tierType === "volume" && volumeBand && (
              <div className="rounded-xl border p-2 bg-muted/30">
                <div className="text-xs font-medium mb-1">
                  Selected volume band (flat)
                </div>
                <div className="text-xs flex items-center justify-between">
                  <span>
                    Band: {volumeBand.min}
                    {volumeBand.max ? `–${volumeBand.max}` : "+"} (units:{" "}
                    {quantity})
                  </span>
                  <span>
                    Band calc: {volumeBand.effectiveQty} ×{" "}
                    {money(volumeBand.unit)} ={" "}
                    {money(volumeBand.effectiveQty * volumeBand.unit)}
                  </span>
                </div>
              </div>
            )}

            {/* Stairstep band summary */}
            {pricing.tierType === "stairstep" && stairstepBand && (
              <div className="rounded-xl border p-2 bg-muted/30">
                <div className="text-xs font-medium mb-1">
                  Selected band (flat)
                </div>
                <div className="text-xs flex items-center justify-between">
                  <span>
                    Band: {stairstepBand.min}
                    {stairstepBand.max
                      ? `–${stairstepBand.max}`
                      : "+"} (units: {quantity})
                  </span>
                  <span>Band price: {money(stairstepBand.flat)}</span>
                </div>
              </div>
            )}

            <div className="pt-1">
              <div className="flex items-center justify-between">
                <span>
                  Subtotal ({breakdown.quantity} {label}
                  {breakdown.quantity > 1 ? "s" : ""})
                </span>
                <span>{money(breakdown.subtotal)}</span>
              </div>
              {typeof breakdown.discount === "number" &&
                breakdown.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Discount ({pricing.discountPercentage ?? 0}%)</span>
                    <span>-{money(breakdown.discount)}</span>
                  </div>
                )}
              {typeof breakdown.net === "number" && (
                <div className="flex items-center justify-between">
                  <span>Net</span>
                  <span>{money(breakdown.net)}</span>
                </div>
              )}
              {(pricing.vatPercentage ?? 0) > 0 && (
                breakdown.vat && breakdown.vat > 0 ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span>VAT ({pricing.vatPercentage ?? 0}%)</span>
                      <span>{money(breakdown.vat)}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Calc: {money(breakdown.net || 0)} × {pricing.vatPercentage ?? 0}% = {money(breakdown.vat)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                      <span>VAT ({pricing.vatPercentage ?? 0}%) included in price</span>
                      {(() => {
                        const rate = pricing.vatPercentage ?? 0;
                        const base = Math.max(0, (breakdown.total || 0));
                        const included = base * rate / (100 + rate);
                        return <span>{money(included)}</span>;
                      })()}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {(() => {
                        const rate = pricing.vatPercentage ?? 0;
                        const base = Math.max(0, (breakdown.total || 0));
                        const included = base * rate / (100 + rate);
                        return (
                          <>
                            Calc: {money(base)} × {rate}% ÷ (100% + {rate}%) = {money(included)}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )
              )}
              <div className="flex items-center justify-between font-semibold border-t pt-2 mt-1">
                <span>Total</span>
                <span>{money(breakdown.total)}</span>
              </div>
            </div>

            {/* Installments preview for per_unit */}
            {pricing.model === "one_time" && pricing.installments?.enabled && (
              <div className="rounded-xl border p-2 mt-3 bg-muted/30">
                <div className="text-xs font-medium mb-1">Installments</div>
                {(() => {
                  const plan = computeInstallments(
                    breakdown.total,
                    pricing.installments
                  );
                  if (!plan) return null;
                  return (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Down payment</span>
                        <span>{money(plan.downPayment)}</span>
                      </div>
                      {plan.plan.map((amt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span>Installment {i + 1}</span>
                          <span>{money(amt)}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <div>
              <span className="font-medium">One-time:</span>{" "}
              {money(Number(pricing.basePrice || 0))}
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{money(breakdown.subtotal)}</span>
              </div>
              {typeof breakdown.discount === "number" &&
                breakdown.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Discount ({pricing.discountPercentage ?? 0}%)</span>
                    <span>-{money(breakdown.discount)}</span>
                  </div>
                )}
              {typeof breakdown.net === "number" && (
                <div className="flex items-center justify-between">
                  <span>Net</span>
                  <span>{money(breakdown.net)}</span>
                </div>
              )}
              {(pricing.vatPercentage ?? 0) > 0 && (
                breakdown.vat && breakdown.vat > 0 ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span>VAT ({pricing.vatPercentage ?? 0}%)</span>
                      <span>{money(breakdown.vat)}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Calc: {money(breakdown.net || 0)} × {pricing.vatPercentage ?? 0}% = {money(breakdown.vat)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                      <span>VAT ({pricing.vatPercentage ?? 0}%) included in price</span>
                      {(() => {
                        const rate = pricing.vatPercentage ?? 0;
                        const base = Math.max(0, (breakdown.total || 0));
                        const included = base * rate / (100 + rate);
                        return <span>{money(included)}</span>;
                      })()}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {(() => {
                        const rate = pricing.vatPercentage ?? 0;
                        const base = Math.max(0, (breakdown.total || 0));
                        const included = base * rate / (100 + rate);
                        return (
                          <>
                            Calc: {money(base)} × {rate}% ÷ (100% + {rate}%) = {money(included)}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )
              )}
              <div className="flex items-center justify-between font-semibold border-t pt-2 mt-1">
                <span>Total</span>
                <span>{money(breakdown.total)}</span>
              </div>
            </div>

            {pricing.installments?.enabled && (
              <div className="rounded-xl border p-2 mt-3 bg-muted/30">
                <div className="text-xs font-medium mb-1">Installments</div>
                {(() => {
                  const plan = computeInstallments(
                    breakdown.total,
                    pricing.installments
                  );
                  if (!plan) return null;
                  return (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Down payment</span>
                        <span>{money(plan.downPayment)}</span>
                      </div>
                      {plan.plan.map((amt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span>Installment {i + 1}</span>
                          <span>{money(amt)}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}

/*************************
 * PricingForm (controlled)
 *************************/
export interface PricingFormProps {
  value: Pricing;
  onChange: (next: Pricing) => void;
  disabled?: boolean;
  showPreview?: boolean; // default true
}


export function PricingForm({
  value,
  onChange,
  disabled,
  showPreview = true,
}: PricingFormProps) {
  const v: Pricing = { ...defaultPricing, ...value };
  
  // Ensure priceBasis is always set (except for free model)
  if (!v.priceBasis && (v.model === "one_time" || v.model === "subscription")) {
    v.priceBasis = "flat";
  }

  const apply = (patch: Partial<Pricing>) => {
    const next: Pricing = { ...v, ...patch };
    
    // Handle taxInclusive toggle: when turning off, clear VAT percentage
    if (typeof patch.taxInclusive !== "undefined") {
      if (!patch.taxInclusive) {
        next.vatPercentage = 0;
      }
    }

    // Handle model changes
    if (patch.model) {
      if (patch.model === "one_time") {
        // Reset to flat by default for one_time
        if (!next.priceBasis) next.priceBasis = "flat";
        next.interval = undefined;
        next.intervalCount = undefined;
      } else if (patch.model === "subscription") {
        // Reset to flat by default for subscription
        if (!next.priceBasis) next.priceBasis = "flat";
        // Subscription requires interval
        next.interval = next.interval || "month";
        next.intervalCount = next.intervalCount || 1;
        // Remove installments for subscriptions
        next.allowInstallments = false;
        next.installments = undefined;
      } else if (patch.model === "free") {
        // Free model: clear pricing fields, only keep currency
        // Use type assertion for free model since priceBasis isn't needed
        const freeNext = next as any;
        freeNext.priceBasis = undefined;
        freeNext.basePrice = undefined;
        freeNext.subscriptionPrice = undefined;
        freeNext.interval = undefined;
        freeNext.intervalCount = undefined;
        next.allowInstallments = false;
        freeNext.installments = undefined;
        freeNext.tiers = undefined;
        freeNext.tierType = undefined;
        freeNext.unitName = undefined;
        next.taxInclusive = false;
        next.vatPercentage = 0;
        next.discountPercentage = 0;
        freeNext.trialDays = undefined;
        freeNext.setupFee = undefined;
        freeNext.autoRenew = undefined;
        freeNext.minTermMonths = undefined;
        freeNext.proration = undefined;
      }
    }
    
    // Handle priceBasis changes
    if (patch.priceBasis) {
      if (patch.priceBasis === "flat") {
        // Remove per_unit specific fields
        delete next.unitName;
        delete next.tierType;
        delete next.tiers;
      } else if (patch.priceBasis === "per_unit") {
        // Set defaults for per_unit
        next.unitName = next.unitName || "team";
        next.tierType = next.tierType || "volume";
        next.tiers = next.tiers || [];
        // Remove basePrice if not needed
        if (!next.basePrice) {
          delete next.basePrice;
        }
      }
    }
    
    onChange(next);
  };

  const CurrencySelect = (
    <Select
      value={v.currency}
      onValueChange={(val: Currency) => apply({ currency: val })}
      disabled={disabled}
    >
      <SelectTrigger className="w-[160px] rounded-[10px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent className="bg-white rounded-[10px]">
        <SelectGroup>
          <SelectLabel>Currency</SelectLabel>
          {(
            [
              "usd",
              "eur",
              "gbp",
              "cad",
              "aud",
              "jpy",
              "inr",
              "ngn",
            ] as Currency[]
          ).map((c) => (
            <SelectItem key={c} value={c} className="capitalize">
              {c} ({currencySymbols[c]})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <>
      {/* Pricing Model */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Pricing Model</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            value={v.model}
            onValueChange={(val: PriceModel) => apply({ model: val as PriceModel })}
            disabled={disabled}
          >
            <Label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
              <RadioGroupItem value="one_time" /> One-time
            </Label>
            <Label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
              <RadioGroupItem value="subscription" /> Subscription
            </Label>
            <Label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
              <RadioGroupItem value="free" /> Free
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Free model - minimal settings */}
          {v.model === "free" && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Free Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CurrencySelect}
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm">
                    This product is free. No pricing configuration is needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* One-time */}
          {v.model === "one_time" && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">One-time Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Basis Selection */}
                <div className="space-y-2">
                  <Label>Price Basis</Label>
                  <RadioGroup
                    value={v.priceBasis || "flat"}
                    onValueChange={(val: PriceBasis) => apply({ priceBasis: val })}
                    disabled={disabled}
                    className="grid grid-cols-2 gap-2"
                  >
                    <Label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
                      <RadioGroupItem value="flat" /> Flat Price
                    </Label>
                    <Label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
                      <RadioGroupItem value="per_unit" /> Per-unit
                    </Label>
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {CurrencySelect}
                  <div className="space-y-1">
                    <Label>Discount %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={v.discountPercentage ?? 0}
                      onChange={(e) =>
                        apply({ discountPercentage: Number(e.target.value || 0) })
                      }
                      disabled={disabled}
                      className="w-[140px] rounded-[10px]"
                    />
                  </div>
                </div>

                {/* Flat Price Fields */}
                {v.priceBasis === "flat" && (
                  <div className="space-y-1">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={v.basePrice ?? 0}
                      disabled={disabled}
                      onChange={(e) =>
                        apply({ basePrice: Number(e.target.value || 0) })
                      }
                      className="w-[220px] rounded-[10px]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={v.taxInclusive}
                      onCheckedChange={(checked) =>
                        apply({ taxInclusive: checked })
                      }
                      disabled={disabled}
                    />
                    <Label>Tax inclusive</Label>
                  </div>
                  {v.taxInclusive && (
                    <div className="space-y-1">
                      <Label>VAT %</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        value={v.vatPercentage ?? 0}
                        onChange={(e) =>
                          apply({ vatPercentage: Number(e.target.value || 0) })
                        }
                        disabled={disabled}
                        className="w-[140px] rounded-[10px]"
                      />
                    </div>
                  )}
                </div>

                {/* Installments - for all one_time pricing (flat and per_unit) */}
                {v.model === "one_time" && (
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Switch
                        checked={v.allowInstallments ?? false}
                      onCheckedChange={(checked) =>
                        apply({
                            allowInstallments: checked,
                          installments: checked
                            ? v.installments ?? {
                                enabled: true,
                                count: 2,
                                  interval: "month",
                                  intervalCount: 1,
                                downPaymentType: "percent",
                                downPaymentValue: 20,
                              }
                            : undefined,
                        })
                      }
                      disabled={disabled}
                    />
                      <Label>Allow Installments</Label>
                  </div>

                    {v.allowInstallments && v.installments && (
                    <>
                      <div className="space-y-1">
                        <Label>Count</Label>
                        <Input
                          type="number"
                          min={2}
                          value={v.installments.count}
                          onChange={(e) =>
                            apply({
                              installments: {
                                ...v.installments!,
                                count: Math.max(2, Number(e.target.value || 2)),
                              },
                            })
                          }
                            disabled={disabled}
                            className="w-[120px] rounded-[10px]"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Interval</Label>
                          <Select
                            value={v.installments.interval}
                            onValueChange={(val: Interval) =>
                              apply({
                                installments: {
                                  ...v.installments!,
                                  interval: val,
                                },
                              })
                            }
                            disabled={disabled}
                          >
                            <SelectTrigger className="w-[160px] rounded-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-[10px]">
                              <SelectItem value="day">day</SelectItem>
                              <SelectItem value="week">week</SelectItem>
                              <SelectItem value="month">month</SelectItem>
                              <SelectItem value="year">year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label>Interval Count</Label>
                          <Input
                            type="number"
                            min={1}
                            value={v.installments.intervalCount}
                            onChange={(e) =>
                              apply({
                                installments: {
                                  ...v.installments!,
                                  intervalCount: Number(e.target.value || 1),
                                },
                              })
                            }
                            disabled={disabled}
                            className="w-[120px] rounded-[10px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Down payment type</Label>
                        <Select
                          value={v.installments.downPaymentType}
                          onValueChange={(val: DownPaymentType) =>
                            apply({
                              installments: {
                                ...v.installments!,
                                downPaymentType: val,
                              },
                            })
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger className="w-[160px] rounded-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-[10px]">
                            <SelectItem value="percent">percent</SelectItem>
                            <SelectItem value="amount">amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>
                          {v.installments.downPaymentType === "percent"
                            ? "Down payment (%)"
                            : "Down payment amount"}
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={v.installments.downPaymentValue}
                          onChange={(e) =>
                            apply({
                              installments: {
                                ...v.installments!,
                                downPaymentValue: Number(e.target.value || 0),
                              },
                            })
                          }
                          disabled={disabled}
                          className="w-[160px] rounded-[10px]"
                        />
                      </div>
                    </>
                  )}
                </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Subscription */}
          {v.model === "subscription" && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  Subscription Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Basis Selection */}
                <div className="space-y-2">
                  <Label>Price Basis</Label>
                  <RadioGroup
                    value={v.priceBasis || "flat"}
                    onValueChange={(val: PriceBasis) => apply({ priceBasis: val })}
                    disabled={disabled}
                    className="grid grid-cols-2 gap-2"
                  >
                    <Label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
                      <RadioGroupItem value="flat" /> Flat Price
                    </Label>
                    <Label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
                      <RadioGroupItem value="per_unit" /> Per-unit
                    </Label>
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {CurrencySelect}
                  <div className="space-y-1">
                    <Label>Every</Label>
                    <Input
                      type="number"
                      min={1}
                      value={v.intervalCount ?? 1}
                      onChange={(e) =>
                        apply({ intervalCount: Number(e.target.value || 1) })
                      }
                      disabled={disabled}
                      className="w-[100px] rounded-[10px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Interval</Label>
                    <Select
                      value={v.interval || "month"}
                      onValueChange={(val: Interval) =>
                        apply({ interval: val })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-[160px] rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-[10px]">
                        <SelectItem value="day">day</SelectItem>
                        <SelectItem value="week">week</SelectItem>
                        <SelectItem value="month">month</SelectItem>
                        <SelectItem value="year">year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Discount %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={v.discountPercentage ?? 0}
                      onChange={(e) =>
                        apply({ discountPercentage: Number(e.target.value || 0) })
                      }
                      disabled={disabled}
                      className="w-[140px] rounded-[10px]"
                    />
                  </div>
                </div>

                {/* Flat Price Fields */}
                {v.priceBasis === "flat" && (
                  <div className="space-y-1">
                    <Label>Subscription price</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={v.basePrice ?? 0}
                      onChange={(e) =>
                        apply({ basePrice: Number(e.target.value || 0) })
                      }
                      disabled={disabled}
                      className="w-[220px] rounded-[10px]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={v.taxInclusive}
                      onCheckedChange={(checked) =>
                        apply({ taxInclusive: checked })
                      }
                      disabled={disabled}
                    />
                    <Label>Tax inclusive</Label>
                  </div>
                  {v.taxInclusive && (
                  <div className="space-y-1">
                      <Label>VAT %</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        value={v.vatPercentage ?? 0}
                        onChange={(e) =>
                          apply({ vatPercentage: Number(e.target.value || 0) })
                        }
                        disabled={disabled}
                        className="w-[140px] rounded-[10px]"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Subscription Fields */}
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Trial Days</Label>
                    <Input
                      type="number"
                      min={0}
                      value={v.trialDays ?? 0}
                      onChange={(e) =>
                        apply({ trialDays: Number(e.target.value || 0) })
                      }
                      disabled={disabled}
                        className="w-full rounded-[10px]"
                        placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                      <Label>Setup Fee</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={v.setupFee ?? 0}
                        onChange={(e) =>
                          apply({ setupFee: Number(e.target.value || 0) })
                        }
                        disabled={disabled}
                        className="w-full rounded-[10px]"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Minimum Term (Months)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={v.minTermMonths ?? 0}
                      onChange={(e) =>
                        apply({ minTermMonths: Number(e.target.value || 0) })
                      }
                      disabled={disabled}
                        className="w-full rounded-[10px]"
                        placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Switch
                        checked={v.autoRenew ?? true}
                      onCheckedChange={(checked) =>
                        apply({ autoRenew: checked })
                      }
                      disabled={disabled}
                    />
                      <Label>Auto Renew</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                        checked={v.proration ?? true}
                      onCheckedChange={(checked) =>
                        apply({ proration: checked })
                      }
                      disabled={disabled}
                    />
                      <Label>Proration</Label>
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Per-unit Settings - shown when priceBasis is per_unit */}
          {v.priceBasis === "per_unit" && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Per-unit Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  {CurrencySelect}
                  <div className="space-y-1">
                    <Label>Unit Name</Label>
                    <Select
                      value={v.unitName || "team"}
                      onValueChange={(val: "person" | "team") =>
                        apply({ unitName: val })
                      }
                      required
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-[200px] rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-[10px]">
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="person">Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Min qty</Label>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={v.minQty ?? 1}
                      onChange={(e) =>
                        apply({ minQty: Number(e.target.value || 1) })
                      }
                      disabled={disabled}
                      className="w-[120px] rounded-[10px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Max qty</Label>
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      step={1}
                      value={v.maxQty ?? 1000}
                      onChange={(e) =>
                        apply({
                          maxQty: Number(e.target.value || v.minQty || 1),
                        })
                      }
                      disabled={disabled}
                      className="w-[120px] rounded-[10px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="space-y-1">
                    <Label>Tier type</Label>
                    <Select
                      value={v.tierType || "volume"}
                      onValueChange={(val: TierType) =>
                        apply({ tierType: val })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-[200px] rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-[10px]">
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="stairstep">Stairstep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                  <TierEditor
                  tierType={(v.tierType || "volume") as TierType}
                    tiers={v.tiers || []}
                    onChange={(next) => apply({ tiers: next })}
                    disabled={disabled}
                  />

                  {/* Installments - for one_time per_unit */}
                  {v.model === "one_time" && (
                    <div className="border-t pt-4 mt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={v.allowInstallments ?? false}
                          onCheckedChange={(checked) =>
                            apply({
                              allowInstallments: checked,
                              installments: checked
                                ? v.installments ?? {
                                    enabled: true,
                                    count: 2,
                                    interval: "month",
                                    intervalCount: 1,
                                    downPaymentType: "percent",
                                    downPaymentValue: 20,
                                    allowEarlyPayoff: false,
                                    provider: "in_house",
                                  }
                                : undefined,
                            })
                          }
                          disabled={disabled}
                        />
                        <Label>Allow Installments</Label>
                      </div>

                      {v.allowInstallments && v.installments && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label>Count</Label>
                              <Input
                                type="number"
                                min={2}
                                value={v.installments.count}
                                onChange={(e) =>
                                  apply({
                                    installments: {
                                      ...v.installments!,
                                      count: Math.max(2, Number(e.target.value || 2)),
                                    },
                                  })
                                }
                                disabled={disabled}
                                className="w-full rounded-[10px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Interval</Label>
                              <Select
                                value={v.installments.interval}
                                onValueChange={(val: Interval) =>
                                  apply({
                                    installments: {
                                      ...v.installments!,
                                      interval: val,
                                    },
                                  })
                                }
                                disabled={disabled}
                              >
                                <SelectTrigger className="w-full rounded-[10px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-[10px]">
                                  <SelectItem value="day">day</SelectItem>
                                  <SelectItem value="week">week</SelectItem>
                                  <SelectItem value="month">month</SelectItem>
                                  <SelectItem value="year">year</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label>Interval Count</Label>
                              <Input
                                type="number"
                                min={1}
                                value={v.installments.intervalCount}
                                onChange={(e) =>
                                  apply({
                                    installments: {
                                      ...v.installments!,
                                      intervalCount: Number(e.target.value || 1),
                                    },
                                  })
                                }
                                disabled={disabled}
                                className="w-full rounded-[10px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Down payment type</Label>
                              <Select
                                value={v.installments.downPaymentType}
                                onValueChange={(val: DownPaymentType) =>
                                  apply({
                                    installments: {
                                      ...v.installments!,
                                      downPaymentType: val,
                                    },
                                  })
                                }
                                disabled={disabled}
                              >
                                <SelectTrigger className="w-full rounded-[10px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-[10px]">
                                  <SelectItem value="percent">percent</SelectItem>
                                  <SelectItem value="amount">amount</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label>
                                {v.installments.downPaymentType === "percent"
                                  ? "Down payment (%)"
                                  : "Down payment amount"}
                              </Label>
                              <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={v.installments.downPaymentValue}
                                onChange={(e) =>
                                  apply({
                                    installments: {
                                      ...v.installments!,
                                      downPaymentValue: Number(e.target.value || 0),
                                    },
                                  })
                                }
                                disabled={disabled}
                                className="w-full rounded-[10px]"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={v.installments.allowEarlyPayoff ?? false}
                                onCheckedChange={(checked) =>
                                  apply({
                                    installments: {
                                      ...v.installments!,
                                      allowEarlyPayoff: checked,
                                    },
                                  })
                                }
                                disabled={disabled}
                              />
                              <Label>Allow Early Payoff</Label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview side */}
        <div className="lg:col-span-5 space-y-4">
          {showPreview && (
              <PricePreviewCard
                pricing={v}
              quantity={v.priceBasis === "per_unit" ? (v.minQty ?? 1) : 1}
              />
          )}
        </div>
      </div>
    </>
  );
}

/*************************
 * Example usage (commented)
 *************************/
// const [pricing, setPricing] = useState<Pricing>({
//   model: 'per_unit',
//   currency: 'gbp',
//   taxInclusive: false,
//   vatPercentage: 20,
//   unitName: 'team',
//   allowQuantity: true,
//   minQty: 1,
//   maxQty: 100,
//   tierType: 'volume',
//   tiers: [
//     { upTo: 10, unitPrice: 150 },
//     { upTo: 25, unitPrice: 135 },
//     { upTo: 999999, unitPrice: 120 }, // open-ended
//   ],
//   discountPercent: 0,
// });
// <PricingForm value={pricing} onChange={setPricing} />

export default PricingForm;
