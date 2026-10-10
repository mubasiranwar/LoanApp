import { CURRENCY_CODE, LOCALE } from "@/constants/currency";

export function formatAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY_CODE,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat(LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}
