import { CheckCircle2, CircleDollarSign, Clock3, XCircle } from "lucide-react";
import { LOAN_STATUS } from "@/constants/loanStatus";

// `status: null` means "all loans".
const cards = [
  {
    key: "total",
    status: null,
    label: "Total applications",
    icon: CircleDollarSign,
    iconClass: "bg-slate-100 text-slate-600",
  },
  {
    key: "pending",
    status: LOAN_STATUS.PENDING,
    label: "Pending review",
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-700",
  },
  {
    key: "approved",
    status: LOAN_STATUS.APPROVED,
    label: "Approved",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "rejected",
    status: LOAN_STATUS.REJECTED,
    label: "Rejected",
    icon: XCircle,
    iconClass: "bg-rose-50 text-rose-700",
  },
];

export default function SummaryCards({ summary, isLoading = false, isError = false }) {
  return (
    <section aria-label="Application summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map(({ key, label, icon: Icon, iconClass }) => {
        return (
          <article
            key={key}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
              <span className={`flex size-9 items-center justify-center rounded-lg ${iconClass}`}>
                <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
              </span>
            </div>
            <p
              className={`mt-3 text-2xl font-semibold tracking-tight text-slate-900 ${
                isLoading ? "animate-pulse" : ""
              }`}
              aria-label={
                isLoading ? `Loading ${label.toLowerCase()}` : isError ? `${label} unavailable` : undefined
              }
            >
              {isLoading || isError ? "—" : summary?.[key] ?? "—"}
            </p>
          </article>
        );
      })}
    </section>
  );
}
