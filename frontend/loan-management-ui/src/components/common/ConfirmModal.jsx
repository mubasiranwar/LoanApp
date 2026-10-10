"use client";

import { AlertTriangle } from "lucide-react";
import Modal, { ModalCloseButton } from "./Modal";

const TONES = {
  danger: {
    icon: "bg-rose-50 text-rose-700",
    button: "bg-rose-600 hover:bg-rose-700",
  },
  primary: {
    icon: "bg-sky-50 text-primary",
    button: "bg-primary hover:bg-primary-hover",
  },
};

// A "Are you sure?" dialog. DeleteModal and DecisionModal are thin wrappers.
export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  busyLabel,
  tone = "danger",
  icon: Icon = AlertTriangle,
  isBusy,
  error,
  onClose,
  onConfirm,
}) {
  const styles = TONES[tone];

  return (
    <Modal
      role="alertdialog"
      labelledBy="confirm-modal-title"
      maxWidth="max-w-md"
      isBusy={isBusy}
      onClose={onClose}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <span className={`flex size-11 items-center justify-center rounded-full ${styles.icon}`}>
            <Icon size={21} aria-hidden="true" />
          </span>
          <ModalCloseButton onClick={onClose} disabled={isBusy} />
        </div>
        <h2 id="confirm-modal-title" className="mt-4 text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${styles.button}`}
          >
            {isBusy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
