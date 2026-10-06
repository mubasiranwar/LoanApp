import { FileText, Pencil, Trash2 } from "lucide-react";

const statusStyles = {
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/15",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

function formatAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function LoadingRows() {
  return (
    <div className="divide-y divide-slate-100" aria-label="Loading applications">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 px-5 py-5 sm:grid-cols-7">
          {Array.from({ length: 7 }, (_, cell) => (
            <span
              key={cell}
              className={`h-4 animate-pulse rounded bg-slate-100 ${
                cell > 2 ? "hidden sm:block" : "block"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LoanTable({ loans = [], isLoading, isError, onEdit, onDelete }) {
  return (
    <section
      id="applications"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      aria-label="Loan applications"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">Applications</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Review and manage submitted loan requests
          </p>
        </div>
        {!isLoading && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {loans.length} {loans.length === 1 ? "application" : "applications"}
          </span>
        )}
      </div>

      {isLoading ? (
        <LoadingRows />
      ) : isError ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-700">
            <FileText size={22} aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900">Applications unavailable</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            The application list could not be loaded. Check the connection and try again.
          </p>
        </div>
      ) : loans.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <FileText size={22} aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900">No applications yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            New loan applications will appear here once they have been created.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Applicant</th>
                <th scope="col" className="px-4 py-3.5">Amount</th>
                <th scope="col" className="px-4 py-3.5">Tenure</th>
                <th scope="col" className="px-4 py-3.5">Purpose</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-4 py-3.5">Created date</th>
                <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((loan) => {
                const status = String(loan.status || "PENDING").toUpperCase();
                return (
                  <tr key={loan.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {loan.applicant_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-700">
                      {formatAmount(loan.amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {loan.tenure_months} months
                    </td>
                    <td className="max-w-52 truncate px-4 py-4 text-slate-600" title={loan.purpose}>
                      {loan.purpose}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          statusStyles[status] || statusStyles.PENDING
                        }`}
                      >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {formatDate(loan.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(loan)}
                          aria-label={`Edit application for ${loan.applicant_name}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-[#0f3d5e]"
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(loan)}
                          aria-label={`Delete application for ${loan.applicant_name}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
