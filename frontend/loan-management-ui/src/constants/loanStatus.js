// Single source of truth for loan statuses on the frontend.
// (Must match LOAN_STATUS in the backend: src/enums/loan-status.enum.js)
export const LOAN_STATUS = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
});

export const LOAN_STATUS_LABELS = {
  [LOAN_STATUS.PENDING]: "Pending",
  [LOAN_STATUS.APPROVED]: "Approved",
  [LOAN_STATUS.REJECTED]: "Rejected",
};

// Tailwind classes for the status badge.
export const LOAN_STATUS_STYLES = {
  [LOAN_STATUS.PENDING]: "bg-amber-50 text-amber-700 ring-amber-600/15",
  [LOAN_STATUS.APPROVED]: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  [LOAN_STATUS.REJECTED]: "bg-rose-50 text-rose-700 ring-rose-600/15",
};
