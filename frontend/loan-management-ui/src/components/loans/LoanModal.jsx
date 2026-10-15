"use client";

import { useState } from "react";
import Modal, { ModalCloseButton } from "../common/Modal";
import Input from "../common/Input";
import { CURRENCY_SYMBOL } from "@/constants/currency";

// NOTE: there is no status field. A new application is always PENDING and only
// an admin can approve or reject it.
const emptyForm = {
  applicant_name: "",
  amount: "",
  tenure_months: "",
  purpose: "",
};

export default function LoanModal({ loan, onClose, onSubmit, isSaving, error }) {
  const [form, setForm] = useState(() =>
    loan
      ? {
          applicant_name: loan.applicant_name || "",
          amount: loan.amount ?? "",
          tenure_months: loan.tenure_months ?? "",
          purpose: loan.purpose || "",
        }
      : emptyForm,
  );
  const isEditing = Boolean(loan);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      applicant_name: form.applicant_name.trim(),
      amount: Number(form.amount),
      tenure_months: Number(form.tenure_months),
      purpose: form.purpose.trim(),
    });
  }

  return (
    <Modal labelledBy="loan-modal-title" isBusy={isSaving} onClose={onClose}>
      <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 id="loan-modal-title" className="text-lg font-semibold text-slate-900">
            {isEditing ? "Edit application" : "New application"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the details for this loan request.
          </p>
        </div>
        <ModalCloseButton onClick={onClose} disabled={isSaving} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
        <Input
          label="Applicant name"
          autoFocus
          name="applicant_name"
          value={form.applicant_name}
          onChange={updateField}
          maxLength={100}
          pattern={String.raw`[\s\S]*\S[\s\S]*`}
          title="Enter at least one non-whitespace character."
          required
          placeholder="e.g. Mubasir Anwar"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Loan amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={updateField}
            required
            startAdornment={CURRENCY_SYMBOL}
            placeholder="25,000"
          />
          <Input
            label="Tenure (months)"
            name="tenure_months"
            type="number"
            min="1"
            step="1"
            value={form.tenure_months}
            onChange={updateField}
            required
            placeholder="36"
          />
        </div>
        <Input
          as="textarea"
          label="Purpose"
          name="purpose"
          value={form.purpose}
          onChange={updateField}
          maxLength={255}
          pattern={String.raw`[\s\S]*\S[\s\S]*`}
          title="Enter at least one non-whitespace character."
          rows={3}
          required
          className="resize-y"
          placeholder="Briefly describe the loan purpose"
        />
        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create application"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
