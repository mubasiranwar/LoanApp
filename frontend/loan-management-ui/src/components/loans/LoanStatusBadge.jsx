import {
  LOAN_STATUS,
  LOAN_STATUS_LABELS,
  LOAN_STATUS_STYLES,
} from "@/constants/loanStatus";

export default function LoanStatusBadge({ status }) {
  const key = LOAN_STATUS_LABELS[status] ? status : LOAN_STATUS.PENDING;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${LOAN_STATUS_STYLES[key]}`}
    >
      {LOAN_STATUS_LABELS[key]}
    </span>
  );
}
