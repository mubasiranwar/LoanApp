"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import DecisionModal from "./DecisionModal";
import DeleteModal from "./DeleteModal";
import LoanModal from "./LoanModal";
import LoanTable from "./LoanTable";
import SummaryCards from "./SummaryCards";
import Navbar from "../layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useLoanActions } from "@/hooks/useLoanActions";
import { useLoans } from "@/hooks/useLoans";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function LoanDashboard() {
  const [page, setPage] = useState(1);
  const { isAdmin } = useAuth();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useLoans(page);
  const loans = data?.loans ?? [];
  const pagination = data?.pagination;
  const actions = useLoanActions({ onCollectionChange: () => setPage(1) });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main id="dashboard" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Loan management</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {isAdmin ? "All Loan Applications" : "Loan Applications"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isAdmin
                ? "Review applications from every applicant and approve or reject them."
                : "Track and manage your applications in one place."}
            </p>
          </div>

          {/* Admins review applications; they do not submit their own. */}
          {!isAdmin && (
            <button
              type="button"
              onClick={actions.openCreate}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 sm:self-auto"
            >
              <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
              New Application
            </button>
          )}
        </div>

        {isError && (
          <div
            role="alert"
            className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-medium text-rose-800">Unable to load applications</p>
              <p className="mt-1 text-sm text-rose-700">{getErrorMessage(error)}</p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100"
            >
              Try again
            </button>
          </div>
        )}

        <div className="space-y-6">
          <SummaryCards summary={data?.summary} isLoading={isLoading} isError={isError} />
          <LoanTable
            loans={loans}
            pagination={pagination}
            page={page}
            isFetching={isFetching}
            onPageChange={setPage}
            isLoading={isLoading}
            isError={isError}
            isAdmin={isAdmin}
            onEdit={actions.openEdit}
            onDelete={actions.requestDelete}
            onDecide={actions.requestDecision}
          />
        </div>
      </main>

      {actions.formOpen && (
        <LoanModal
          key={actions.editingLoan?.id ?? "new"}
          loan={actions.editingLoan}
          onClose={actions.closeForm}
          onSubmit={actions.save}
          isSaving={actions.isSaving}
          error={actions.operationError}
        />
      )}
      {actions.deletingLoan && (
        <DeleteModal
          loan={actions.deletingLoan}
          onClose={actions.closeDelete}
          onConfirm={actions.confirmDelete}
          isDeleting={actions.isDeleting}
          error={actions.operationError}
        />
      )}
      {actions.decision && (
        <DecisionModal
          decision={actions.decision}
          onClose={actions.closeDecision}
          onConfirm={actions.confirmDecision}
          isDeciding={actions.isDeciding}
          error={actions.operationError}
        />
      )}
    </div>
  );
}
