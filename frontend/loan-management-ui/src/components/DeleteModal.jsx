"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteModal({ loan, onClose, onConfirm, isDeleting, error }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isDeleting]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onClose();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <span className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-700">
            <AlertTriangle size={21} aria-hidden="true" />
          </span>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        <h2 id="delete-modal-title" className="mt-4 text-lg font-semibold text-slate-900">
          Delete this loan application?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {loan?.applicant_name
            ? `The application for ${loan.applicant_name} will be permanently removed. This action cannot be undone.`
            : "This application will be permanently removed. This action cannot be undone."}
        </p>
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
