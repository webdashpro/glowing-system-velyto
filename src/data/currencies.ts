export type Currency = { code: string; symbol: string; label: string; locale: string };

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB" },
  { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-IN" },
  { code: "AED", symbol: "AED", label: "UAE Dirham", locale: "en-AE" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar", locale: "en-CA" },
];

export const currencyOf = (code: string): Currency => CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

export function money(amount: number, code: string): string {
  const c = currencyOf(code);
  try {
    return new Intl.NumberFormat(c.locale, { style: "currency", currency: c.code, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${c.symbol}${amount.toFixed(2)}`;
  }
}

/** PDF-safe money string (standard PDF fonts lack ₹ / Arabic glyphs). */
export function pdfMoney(amount: number, code: string): string {
  const n = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (code === "USD") return `$${n}`;
  if (code === "EUR") return `EUR ${n}`;
  if (code === "GBP") return `GBP ${n}`;
  return `${code} ${n}`;
}
