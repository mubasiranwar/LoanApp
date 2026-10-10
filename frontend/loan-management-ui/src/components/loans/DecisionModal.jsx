"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import { LOAN_STATUS } from "@/constants/loanStatus";

// Admin confirmation before approving / rejecting. Decisions are final,
// so a mis-click should never be enough.
export default function DecisionModal({ decision, onClose, onConfirm, isDeciding, error }) {
  const approving = decision.status === LOAN_STATUS.APPROVED;
  const verb = approving ? "approve" : "reject";

  return (
    <ConfirmModal
      tone={approving ? "primary" : "danger"}
      icon={approving ? CheckCircle2 : XCircle}
      title={`${approving ? "Approve" : "Reject"} this application?`}
      message={`You are about to ${verb} the application for ${decision.loan.applicant_name}. This decision is final and the applicant will no longer be able to change it.`}
      confirmLabel={approving ? "Approve" : "Reject"}
      busyLabel={approving ? "Approving…" : "Rejecting…"}
      isBusy={isDeciding}
      error={error}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
