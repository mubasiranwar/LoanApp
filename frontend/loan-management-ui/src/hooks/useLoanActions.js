"use client";

import { useState } from "react";
import {
  useCreateLoan,
  useDeleteLoan,
  useUpdateLoan,
  useUpdateLoanStatus,
} from "@/hooks/useLoans";
import { getErrorMessage } from "@/utils/getErrorMessage";

// Everything the dashboard does besides drawing: which modal is open, which
// loan it is about, calling the API, and the error to show if that fails.
export function useLoanActions() {
  const createLoan = useCreateLoan();
  const updateLoan = useUpdateLoan();
  const deleteLoan = useDeleteLoan();
  const updateStatus = useUpdateLoanStatus();

  const [formOpen, setFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [deletingLoan, setDeletingLoan] = useState(null);
  const [decision, setDecision] = useState(null); // { loan, status } | null
  const [operationError, setOperationError] = useState(null);

  const isSaving = createLoan.isPending || updateLoan.isPending;

  // ---- create / edit ----
  function openCreate() {
    setOperationError(null);
    setEditingLoan(null);
    setFormOpen(true);
  }

  function openEdit(loan) {
    setOperationError(null);
    setEditingLoan(loan);
    setFormOpen(true);
  }

  function closeForm() {
    if (isSaving) return;
    setFormOpen(false);
    setEditingLoan(null);
    setOperationError(null);
  }

  async function save(payload) {
    setOperationError(null);
    try {
      if (editingLoan) {
        await updateLoan.mutateAsync({ id: editingLoan.id, ...payload });
      } else {
        await createLoan.mutateAsync(payload);
      }
      setFormOpen(false);
      setEditingLoan(null);
    } catch (error) {
      setOperationError(getErrorMessage(error));
    }
  }

  // ---- delete ----
  function requestDelete(loan) {
    setOperationError(null);
    setDeletingLoan(loan);
  }

  function closeDelete() {
    if (deleteLoan.isPending) return;
    setDeletingLoan(null);
    setOperationError(null);
  }

  async function confirmDelete() {
    if (!deletingLoan) return;
    setOperationError(null);
    try {
      await deleteLoan.mutateAsync(deletingLoan.id);
      setDeletingLoan(null);
    } catch (error) {
      setOperationError(getErrorMessage(error));
    }
  }

  // ---- admin: approve / reject ----
  function requestDecision(loan, status) {
    setOperationError(null);
    setDecision({ loan, status });
  }

  function closeDecision() {
    if (updateStatus.isPending) return;
    setDecision(null);
    setOperationError(null);
  }

  async function confirmDecision() {
    if (!decision) return;
    setOperationError(null);
    try {
      await updateStatus.mutateAsync({
        id: decision.loan.id,
        status: decision.status,
      });
      setDecision(null);
    } catch (error) {
      setOperationError(getErrorMessage(error));
    }
  }

  return {
    // state
    formOpen,
    editingLoan,
    deletingLoan,
    decision,
    operationError,
    isSaving,
    isDeleting: deleteLoan.isPending,
    isDeciding: updateStatus.isPending,
    // handlers
    openCreate,
    openEdit,
    closeForm,
    save,
    requestDelete,
    closeDelete,
    confirmDelete,
    requestDecision,
    closeDecision,
    confirmDecision,
  };
}
