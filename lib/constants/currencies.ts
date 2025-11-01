export interface CurrencyOption {
  value: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { value: "usd", label: "$ USD" },
  { value: "eur", label: "€ EUR" },
  { value: "gbp", label: "£ GBP" },
  { value: "cad", label: "C$ CAD" },
  { value: "aud", label: "A$ AUD" },
  { value: "jpy", label: "¥ JPY" },
  { value: "inr", label: "₹ INR" },
  { value: "ngn", label: "₦ NGN" },
  { value: "cny", label: "¥ CNY" },
  { value: "chf", label: "CHF" },
  { value: "sek", label: "kr SEK" },
  { value: "nok", label: "kr NOK" },
  { value: "dkk", label: "kr DKK" },
  { value: "pln", label: "zł PLN" },
  { value: "czk", label: "Kč CZK" },
  { value: "huf", label: "Ft HUF" },
  { value: "rub", label: "₽ RUB" },
  { value: "brl", label: "R$ BRL" },
  { value: "mxn", label: "$ MXN" },
  { value: "ars", label: "$ ARS" },
  { value: "clp", label: "$ CLP" },
  { value: "cop", label: "$ COP" },
  { value: "pen", label: "S/ PEN" },
  { value: "uah", label: "₴ UAH" },
  { value: "try", label: "₺ TRY" },
  { value: "ils", label: "₪ ILS" },
  { value: "aed", label: "د.إ AED" },
  { value: "sar", label: "﷼ SAR" },
  { value: "qar", label: "﷼ QAR" },
  { value: "kwd", label: "د.ك KWD" },
  { value: "bhd", label: "د.ب BHD" },
  { value: "omr", label: "﷼ OMR" },
  { value: "jod", label: "د.ا JOD" },
  { value: "egp", label: "£ EGP" },
  { value: "mad", label: "د.م MAD" },
  { value: "tnd", label: "د.ت TND" },
  { value: "dzd", label: "د.ج DZD" },
  { value: "lyd", label: "ل.د LYD" },
  { value: "sdg", label: "ج.س SDG" },
  { value: "etb", label: "Br ETB" },
  { value: "kes", label: "KSh KES" },
  { value: "ugx", label: "USh UGX" },
  { value: "tzs", label: "TSh TZS" },
  { value: "zmw", label: "ZK ZMW" },
  { value: "bwp", label: "P BWP" },
  { value: "zar", label: "R ZAR" },
  { value: "nad", label: "N$ NAD" },
  { value: "szl", label: "L SZL" },
  { value: "lsl", label: "L LSL" },
  { value: "mwk", label: "MK MWK" },
  { value: "mzn", label: "MT MZN" },
  { value: "aoa", label: "Kz AOA" },
  { value: "xaf", label: "FCFA XAF" },
  { value: "xof", label: "CFA XOF" },
  { value: "ghs", label: "₵ GHS" },
  { value: "xdr", label: "SDR XDR" },
];

// Helper function to get currency symbol by code
// /lib/constants/currencies.ts
export function getCurrencySymbol(code?: string) {
  const map: Record<string, string> = {
    gbp: "£",
    usd: "$",
    eur: "€" /* ... */,
  };
  const key = (code ?? "gbp").toLowerCase();
  return map[key] ?? "£";
}

// Helper function to get currency label by code
export const getCurrencyLabel = (currencyCode: string): string => {
  const currency = CURRENCY_OPTIONS.find(
    (c) => c.value === currencyCode.toLowerCase()
  );
  return currency ? currency.label : currencyCode.toUpperCase();
};

// Helper function to check if currency is supported
export const isSupportedCurrency = (currencyCode: string): boolean => {
  return CURRENCY_OPTIONS.some((c) => c.value === currencyCode.toLowerCase());
};
