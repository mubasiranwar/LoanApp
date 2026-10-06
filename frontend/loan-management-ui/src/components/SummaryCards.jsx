import { CheckCircle2, CircleDollarSign, Clock3, XCircle } from "lucide-react";

const cards = [
  {
    key: "total",
    label: "Total applications",
    icon: CircleDollarSign,
    iconClass: "bg-slate-100 text-slate-600",
  },
  {
    key: "pending",
    label: "Pending review",
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-700",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconClass: "bg-rose-50 text-rose-700",
  },
];

export default function SummaryCards({ loans = [], isLoading = false, isError = false }) {
  const counts = {
    total: loans.length,
    pending: loans.filter((loan) => loan.status === "PENDING").length,
    approved: loans.filter((loan) => loan.status === "APPROVED").length,
    rejected: loans.filter((loan) => loan.status === "REJECTED").length,
  };

  return (
    <section aria-label="Application summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map(({ key, label, icon: Icon, iconClass }) => (
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
            {isLoading ? "—" : isError ? "—" : counts[key]}
          </p>
        </article>
      ))}
    </section>
  );
}
