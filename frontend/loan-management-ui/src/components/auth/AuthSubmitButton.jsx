import { ArrowRight, LoaderCircle } from "lucide-react";

export default function AuthSubmitButton({ isSubmitting, label, busyLabel }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? (
        <>
          <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
          {busyLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight size={17} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
