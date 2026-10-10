// Change the currency / locale for the whole app here.
export const LOCALE = "en-US";
export const CURRENCY_CODE = "USD";

// "$" for USD, derived from the code so the two can never disagree.
export const CURRENCY_SYMBOL =
  new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY_CODE })
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value ?? CURRENCY_CODE;
