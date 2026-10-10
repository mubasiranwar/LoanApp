"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import AuthAlert from "./AuthAlert";
import AuthLayout from "./AuthLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import PasswordInput from "./PasswordInput";
import Input from "../common/Input";
import { useAuthSubmit } from "@/hooks/useAuthSubmit";
import { authService } from "@/services/auth.service";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { error, clearError, isSubmitting, submit } = useAuthSubmit(authService.login);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    clearError();
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
  }

  return (
    <AuthLayout
      showcase
      eyebrow="WELCOME BACK"
      title="Sign in to LoanFlow"
      description="Enter your details below to access your loan workspace."
      headerLink={{ href: "/signup", label: "Create account" }}
      footerPrompt="New to LoanFlow?"
      footerLink={{ href: "/signup", label: "Create an account" }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          variant="auth"
          label="Email address"
          autoComplete="email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          maxLength={254}
          required
          placeholder="you@example.com"
        />
        <PasswordInput
          autoComplete="current-password"
          name="password"
          value={form.password}
          onChange={updateField}
          minLength={1}
          maxLength={72}
          required
          placeholder="Enter your password"
        />
        <AuthAlert message={error} />
        <AuthSubmitButton isSubmitting={isSubmitting} label="Sign in" busyLabel="Signing in…" />
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <LockKeyhole size={14} aria-hidden="true" />
        Your account credentials are protected.
      </div>
    </AuthLayout>
  );
}
