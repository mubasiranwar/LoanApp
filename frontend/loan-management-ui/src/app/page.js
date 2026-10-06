"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteModal from "../components/DeleteModal";
import LoanModal from "../components/LoanModal";
import LoanTable from "../components/LoanTable";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import {
  useCreateLoan,
  useDeleteLoan,
  useLoans,
  useUpdateLoan,
} from "../hooks/useLoans";
import { useAuth } from "../context/AuthContext";

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: loans = [], isLoading, isError, error, refetch } = useLoans();
  const createLoan = useCreateLoan();
  const updateLoan = useUpdateLoan();
  const deleteLoan = useDeleteLoan();
  const [editingLoan, setEditingLoan] = useState(null);
  const [deletingLoan, setDeletingLoan] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [operationError, setOperationError] = useState(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthLoading, isAuthenticated, router]);

  function openCreateModal() {
    setOperationError(null);
    setEditingLoan(null);
    setFormOpen(true);
  }

  function openEditModal(loan) {
    setOperationError(null);
    setEditingLoan(loan);
    setFormOpen(true);
  }

  function closeForm() {
    if (createLoan.isPending || updateLoan.isPending) return;
    setFormOpen(false);
    setEditingLoan(null);
    setOperationError(null);
  }

  async function handleSave(payload) {
    setOperationError(null);
    try {
      if (editingLoan) {
        await updateLoan.mutateAsync({ id: editingLoan.id, ...payload });
      } else {
        await createLoan.mutateAsync(payload);
      }
      setFormOpen(false);
      setEditingLoan(null);
    } catch (mutationError) {
      setOperationError(getErrorMessage(mutationError));
    }
  }

  async function handleDelete() {
    if (!deletingLoan) return;
    setOperationError(null);
    try {
      await deleteLoan.mutateAsync(deletingLoan.id);
      setDeletingLoan(null);
    } catch (mutationError) {
      setOperationError(getErrorMessage(mutationError));
    }
  }

  if (isAuthLoading || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500" role="status">
          {isAuthLoading ? "Checking your session…" : "Redirecting to sign in…"}
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main
        id="dashboard"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#0f3d5e]">Loan management</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Loan Applications
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track and manage applicant requests in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#0f3d5e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b314b] focus:outline-none focus:ring-2 focus:ring-[#0f3d5e]/30 focus:ring-offset-2 sm:self-auto"
          >
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
            New Application
          </button>
        </div>

        {isError ? (
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
        ) : null}

        <div className="space-y-6">
          <SummaryCards loans={loans} isLoading={isLoading} isError={isError} />
          <LoanTable
            loans={loans}
            isLoading={isLoading}
            isError={isError}
            onEdit={openEditModal}
            onDelete={(loan) => {
              setOperationError(null);
              setDeletingLoan(loan);
            }}
          />
        </div>
      </main>

      {formOpen && (
        <LoanModal
          key={editingLoan?.id ?? "new"}
          loan={editingLoan}
          onClose={closeForm}
          onSubmit={handleSave}
          isSaving={createLoan.isPending || updateLoan.isPending}
          error={operationError}
        />
      )}
      {deletingLoan && (
        <DeleteModal
          loan={deletingLoan}
          onClose={() => {
            if (!deleteLoan.isPending) {
              setDeletingLoan(null);
              setOperationError(null);
            }
          }}
          onConfirm={handleDelete}
          isDeleting={deleteLoan.isPending}
          error={operationError}
        />
      )}
    </div>
  );
}
