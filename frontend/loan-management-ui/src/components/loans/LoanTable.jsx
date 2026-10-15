import { Check, FileText, Pencil, Trash2, X } from "lucide-react";
import LoanStatusBadge from "./LoanStatusBadge";
import { LOAN_STATUS } from "@/constants/loanStatus";
import { formatAmount, formatDate } from "@/utils/format";

const LOCKED_HINT = "Only pending applications can be changed";

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

function EmptyState({ icon: Icon, tone, title, text }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className={`flex size-12 items-center justify-center rounded-full ${tone}`}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
    </div>
  );
}

// What each row offers, depending on WHO is looking and the loan's STATUS.
//  - Admin:     Approve / Reject while the loan is pending, nothing once decided.
//  - Applicant: Edit / Delete while pending; disabled (not hidden) once decided,
//               so they can see why. The backend enforces the same rules.
function RowActions({ loan, isAdmin, onEdit, onDelete, onDecide }) {
  const isPending = loan.status === LOAN_STATUS.PENDING;

  if (isAdmin) {
    if (!isPending) {
      return <span className="text-xs text-slate-400">Decided</span>;
    }
    return (
      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={() => onDecide(loan, LOAN_STATUS.APPROVED)}
          aria-label={`Approve application for ${loan.applicant_name}`}
          title="Approve"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Check size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDecide(loan, LOAN_STATUS.REJECTED)}
          aria-label={`Reject application for ${loan.applicant_name}`}
          title="Reject"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(loan)}
        disabled={!isPending}
        title={isPending ? "Edit" : LOCKED_HINT}
        aria-label={`Edit application for ${loan.applicant_name}`}
        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
      >
        <Pencil size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(loan)}
        disabled={!isPending}
        title={isPending ? "Delete" : LOCKED_HINT}
        aria-label={`Delete application for ${loan.applicant_name}`}
        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function LoanTable({
  loans = [],
  pagination,
  page,
  isFetching,
  onPageChange,
  isLoading,
  isError,
  isAdmin = false,
  onEdit,
  onDelete,
  onDecide,
}) {
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
            {isAdmin
              ? "Review and decide on submitted loan requests"
              : "Review and manage submitted loan requests"}
          </p>
        </div>
        {!isLoading && !isError && pagination && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {pagination.total} {pagination.total === 1 ? "application" : "applications"}
          </span>
        )}
      </div>

      {isLoading ? (
        <LoadingRows />
      ) : isError ? (
        <EmptyState
          icon={FileText}
          tone="bg-rose-50 text-rose-700"
          title="Applications unavailable"
          text="The application list could not be loaded. Check the connection and try again."
        />
      ) : loans.length === 0 ? (
        <EmptyState
          icon={FileText}
          tone="bg-slate-100 text-slate-500"
          title="No applications yet"
          text={
            isAdmin
              ? "Submitted loan applications will appear here for review."
              : "New loan applications will appear here once they have been created."
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Applicant</th>
                {isAdmin && <th scope="col" className="px-4 py-3.5">Submitted by</th>}
                <th scope="col" className="px-4 py-3.5">Amount</th>
                <th scope="col" className="px-4 py-3.5">Tenure</th>
                <th scope="col" className="px-4 py-3.5">Purpose</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-4 py-3.5">Created date</th>
                <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((loan) => (
                <tr key={loan.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-medium text-slate-900">{loan.applicant_name}</td>
                  {isAdmin && (
                    <td className="px-4 py-4 text-slate-600">
                      {loan.user?.username || loan.user?.email || "—"}
                    </td>
                  )}
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
                    <LoanStatusBadge status={loan.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {formatDate(loan.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <RowActions
                      loan={loan}
                      isAdmin={isAdmin}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDecide={onDecide}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && !isError && pagination && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500" aria-live="polite">
            {pagination.total === 0
              ? "Showing 0 applications"
              : `Showing ${(page - 1) * pagination.limit + 1}–${Math.min(
                  page * pagination.limit,
                  pagination.total,
                )} of ${pagination.total} applications`}
          </p>
          {pagination.totalPages > 1 && (
            <nav aria-label="Loan applications pagination" className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || isFetching}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2 text-sm text-slate-600" aria-current="page">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= pagination.totalPages || isFetching}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      )}
    </section>
  );
}
