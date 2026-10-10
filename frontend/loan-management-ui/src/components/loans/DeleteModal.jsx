"use client";

import ConfirmModal from "../common/ConfirmModal";

export default function DeleteModal({ loan, onClose, onConfirm, isDeleting, error }) {
  return (
    <ConfirmModal
      tone="danger"
      title="Delete this loan application?"
      message={
        loan?.applicant_name
          ? `The application for ${loan.applicant_name} will be permanently removed. This action cannot be undone.`
          : "This application will be permanently removed. This action cannot be undone."
      }
      confirmLabel="Delete"
      busyLabel="Deleting…"
      isBusy={isDeleting}
      error={error}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
