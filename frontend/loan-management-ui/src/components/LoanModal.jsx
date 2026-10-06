"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  applicant_name: "",
  amount: "",
  tenure_months: "",
  purpose: "",
  status: "PENDING",
};

export default function LoanModal({ loan, onClose, onSubmit, isSaving, error }) {
  const [form, setForm] = useState(() =>
    loan
      ? {
          applicant_name: loan.applicant_name || "",
          amount: loan.amount ?? "",
          tenure_months: loan.tenure_months ?? "",
          purpose: loan.purpose || "",
          status: loan.status || "PENDING",
        }
      : emptyForm,
  );
  const [validationError, setValidationError] = useState("");
  const isEditing = Boolean(loan);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isSaving]);

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
      status: form.status,
    });
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f3d5e] focus:ring-2 focus:ring-[#0f3d5e]/15";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="loan-modal-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 id="loan-modal-title" className="text-lg font-semibold text-slate-900">
              {isEditing ? "Edit application" : "New application"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the details for this loan request.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <label className="block text-sm font-medium text-slate-700">
            Applicant name
            <input
              autoFocus
              name="applicant_name"
              value={form.applicant_name}
              onChange={updateField}
              maxLength={100}
              required
              className={inputClass}
              placeholder="e.g. Jordan Lee"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Loan amount
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={updateField}
                  required
                  className={`${inputClass} mt-0 pl-7`}
                  placeholder="25,000"
                />
              </div>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Tenure (months)
              <input
                name="tenure_months"
                type="number"
                min="1"
                step="1"
                value={form.tenure_months}
                onChange={updateField}
                required
                className={inputClass}
                placeholder="36"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Purpose
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={updateField}
              maxLength={255}
              rows={3}
              required
              className={`${inputClass} resize-y`}
              placeholder="Briefly describe the loan purpose"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Status
            <select name="status" value={form.status} onChange={updateField} className={inputClass}>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </label>
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
              className="rounded-lg bg-[#0f3d5e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b314b] disabled:opacity-60"
            >
              {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create application"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
