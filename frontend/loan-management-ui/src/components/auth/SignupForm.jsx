"use client";

import { useState } from "react";
import AuthAlert from "./AuthAlert";
import AuthLayout from "./AuthLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import PasswordInput from "./PasswordInput";
import Input from "../common/Input";
import { useAuthSubmit } from "@/hooks/useAuthSubmit";
import { authService } from "@/services/auth.service";

export default function SignupForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { error, clearError, isSubmitting, submit } = useAuthSubmit(authService.signup);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    clearError();
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit({
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
  }

  return (
    <AuthLayout
      eyebrow="GET STARTED"
      title="Create your account"
      description="Create a secure workspace to manage your loan applications."
      headerLink={{ href: "/login", label: "Sign in" }}
      footerPrompt="Already have an account?"
      footerLink={{ href: "/login", label: "Sign in" }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          variant="auth"
          label="Username"
          autoComplete="username"
          name="username"
          value={form.username}
          onChange={updateField}
          minLength={2}
          maxLength={100}
          required
          placeholder="Your name"
        />
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
          autoComplete="new-password"
          name="password"
          value={form.password}
          onChange={updateField}
          minLength={8}
          maxLength={72}
          required
          placeholder="At least 8 characters"
          hint="Use at least 8 characters. Your password is securely hashed."
        />
        <AuthAlert message={error} />
        <AuthSubmitButton
          isSubmitting={isSubmitting}
          label="Create account"
          busyLabel="Creating account…"
        />
      </form>
    </AuthLayout>
  );
}
