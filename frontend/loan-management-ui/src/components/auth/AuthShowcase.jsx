import { Check, Landmark, ShieldCheck } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  "All your applications in one place",
  "Clear status and progress at a glance",
  "Your account, your private workspace",
];

// The dark brand panel shown beside the login form on large screens.
export default function AuthShowcase() {
  return (
    <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-primary-dark px-12 py-11 text-white lg:flex xl:px-20">
      <div className="pointer-events-none absolute -right-36 -top-36 size-[520px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute -right-16 -top-16 size-[360px] rounded-full border border-white/[0.08]" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-primary/80" />

      <Link href="/login" className="relative flex w-fit items-center gap-3" aria-label="LoanFlow sign in">
        <span className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
          <Landmark size={20} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-xl font-semibold tracking-tight">
          Loan<span className="text-sky-200">Flow</span>
        </span>
      </Link>

      <div className="relative my-16 max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-medium tracking-wide text-sky-100">
          <span className="size-1.5 rounded-full bg-emerald-300" />
          YOUR LOAN WORKSPACE
        </span>
        <h2 className="mt-7 max-w-lg text-4xl font-semibold leading-[1.15] tracking-tight xl:text-5xl">
          A clearer view of every application.
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
          Sign in to stay on top of your loan requests, review progress, and
          keep your application details organized.
        </p>

        <div className="mt-10 space-y-4">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-sm text-slate-200">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-sky-200">
                <Check size={14} strokeWidth={2.4} aria-hidden="true" />
              </span>
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400">
        <span>LoanFlow · Loan management, made clear.</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={14} aria-hidden="true" />
          Secure sign in
        </span>
      </div>
    </aside>
  );
}
