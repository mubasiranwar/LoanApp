"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

// Shared modal shell: dark backdrop, Escape to close, click outside to close.
// While `isBusy` (a request is running) the modal refuses to close.
export default function Modal({
  labelledBy,
  role = "dialog",
  maxWidth = "max-w-lg",
  isBusy = false,
  onClose,
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isBusy) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isBusy]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) onClose();
      }}
    >
      <section
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`my-auto w-full ${maxWidth} rounded-2xl bg-white shadow-xl`}
      >
        {children}
      </section>
    </div>
  );
}

export function ModalCloseButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Close dialog"
      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
    >
      <X size={19} aria-hidden="true" />
    </button>
  );
}
