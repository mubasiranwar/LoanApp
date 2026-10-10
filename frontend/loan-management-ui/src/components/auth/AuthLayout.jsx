import { Landmark } from "lucide-react";
import Link from "next/link";
import AuthShowcase from "./AuthShowcase";

// The page frame shared by login and signup: header, heading, footer.
// `children` is the form. `showcase` adds the brand panel (login only).
export default function AuthLayout({
  showcase = false,
  eyebrow,
  title,
  description,
  headerLink,
  footerPrompt,
  footerLink,
  children,
}) {
  return (
    <main
      className={
        showcase
          ? "min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)]"
          : "min-h-screen bg-white"
      }
    >
      {showcase && <AuthShowcase />}

      <section className="flex min-h-screen flex-col bg-slate-50/70 px-5 py-6 sm:px-10 lg:justify-center lg:px-12 xl:px-20">
        <header className="mx-auto flex w-full max-w-md items-center justify-between">
          <Link
            href="/login"
            className={`flex items-center gap-2.5 ${showcase ? "lg:hidden" : ""}`}
            aria-label="LoanFlow sign in"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
              <Landmark size={19} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Loan<span className="text-primary">Flow</span>
            </span>
          </Link>
          <Link
            href={headerLink.href}
            className="ml-auto text-sm font-medium text-slate-600 transition hover:text-primary"
          >
            {headerLink.label}
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10 lg:flex-none lg:py-0">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold text-primary">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            </div>

            {children}

            <p className="mt-8 text-center text-sm text-slate-600">
              {footerPrompt}{" "}
              <Link
                href={footerLink.href}
                className="font-semibold text-primary hover:text-primary-hover"
              >
                {footerLink.label}
              </Link>
            </p>
          </div>
        </div>

        <footer className="mx-auto w-full max-w-md text-center text-xs text-slate-400">
          © {new Date().getFullYear()} LoanFlow. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
