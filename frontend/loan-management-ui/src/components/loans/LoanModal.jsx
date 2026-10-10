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
  const [validationError, setValidationError] = useState("");
  const isEditing = Boolean(loan);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setValidationError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = form.applicant_name.trim();
    const purpose = form.purpose.trim();
    const amount = Number(form.amount);
    const tenure = Number(form.tenure_months);

    if (!name || !purpose) {
      setValidationError("Applicant name and purpose are required.");
      return;
    }
    if (name.length > 100 || purpose.length > 255) {
      setValidationError("Applicant name must be at most 100 characters and purpose at most 255.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setValidationError("Enter a loan amount greater than zero.");
      return;
    }
    if (!Number.isInteger(tenure) || tenure <= 0) {
      setValidationError("Enter a whole-number tenure greater than zero.");
      return;
    }

    onSubmit({
      applicant_name: name,
      amount,
      tenure_months: tenure,
      purpose,
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
          required
          placeholder="e.g. Jordan Lee"
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
          rows={3}
          required
          className="resize-y"
          placeholder="Briefly describe the loan purpose"
        />
        {(validationError || error) && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            {validationError || error}
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
