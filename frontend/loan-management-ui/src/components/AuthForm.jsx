"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    "We couldn't complete your request. Please try again."
  );
}

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup
        ? {
            username: form.username.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }
        : {
            email: form.email.trim().toLowerCase(),
            password: form.password,
          };
      const response = await api.post(endpoint, payload);
      const { token, user } = response.data.data;
      login(token, user);
      router.replace("/");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0f3d5e] focus:bg-white focus:ring-4 focus:ring-[#0f3d5e]/10";

  return (
    <main
      className={
        isSignup
          ? "min-h-screen bg-white"
          : "min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)]"
      }
    >
      {!isSignup && (
        <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#0b314b] px-12 py-11 text-white lg:flex xl:px-20">
          <div className="pointer-events-none absolute -right-36 -top-36 size-[520px] rounded-full border border-white/[0.07]" />
          <div className="pointer-events-none absolute -right-16 -top-16 size-[360px] rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-[#0f3d5e]/80" />

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
              {[
                "All your applications in one place",
                "Clear status and progress at a glance",
                "Your account, your private workspace",
              ].map((feature) => (
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
      )}

      <section className="flex min-h-screen flex-col bg-slate-50/70 px-5 py-6 sm:px-10 lg:justify-center lg:px-12 xl:px-20">
        <header className="mx-auto flex w-full max-w-md items-center justify-between">
          <Link
            href="/login"
            className={`flex items-center gap-2.5 ${isSignup ? "" : "lg:hidden"}`}
            aria-label="LoanFlow sign in"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#0f3d5e] text-white">
              <Landmark size={19} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Loan<span className="text-[#0f3d5e]">Flow</span>
            </span>
          </Link>
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="ml-auto text-sm font-medium text-slate-600 transition hover:text-[#0f3d5e]"
          >
            {isSignup ? "Sign in" : "Create account"}
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10 lg:flex-none lg:py-0">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold text-[#0f3d5e]">
                {isSignup ? "GET STARTED" : "WELCOME BACK"}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {isSignup ? "Create your account" : "Sign in to LoanFlow"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {isSignup
                  ? "Create a secure workspace to manage your loan applications."
                  : "Enter your details below to access your loan workspace."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <label className="block text-sm font-medium text-slate-700">
                  Username
                  <input
                    autoComplete="username"
                    name="username"
                    value={form.username}
                    onChange={updateField}
                    minLength={2}
                    maxLength={100}
                    required
                    className={inputClass}
                    placeholder="Your name"
                  />
                </label>
              )}
              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  autoComplete="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  maxLength={254}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <span className="relative mt-2 block">
                  <input
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateField}
                    minLength={isSignup ? 8 : 1}
                    maxLength={72}
                    required
                    className={`${inputClass} mt-0 pr-12`}
                    placeholder={isSignup ? "At least 8 characters" : "Enter your password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f3d5e]/30"
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </span>
                {isSignup && (
                  <span className="mt-2 block text-xs font-normal text-slate-500">
                    Use at least 8 characters. Your password is securely hashed.
                  </span>
                )}
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d5e] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b314b] focus:outline-none focus:ring-4 focus:ring-[#0f3d5e]/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                    {isSignup ? "Creating account…" : "Signing in…"}
                  </>
                ) : (
                  <>
                    {isSignup ? "Create account" : "Sign in"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {!isSignup && (
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <LockKeyhole size={14} aria-hidden="true" />
                Your account credentials are protected.
              </div>
            )}

            <p className="mt-8 text-center text-sm text-slate-600">
              {isSignup ? "Already have an account?" : "New to LoanFlow?"}{" "}
              <Link
                href={isSignup ? "/login" : "/signup"}
                className="font-semibold text-[#0f3d5e] hover:text-[#0b314b]"
              >
                {isSignup ? "Sign in" : "Create an account"}
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
