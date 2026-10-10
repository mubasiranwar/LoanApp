"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/utils/getErrorMessage";

const AUTH_FALLBACK_MESSAGE =
  "We couldn't complete your request. Please try again.";

// Shared by LoginForm and SignupForm: call the API, start the session, go home.
export function useAuthSubmit(request) {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(payload) {
    setError("");
    setIsSubmitting(true);
    try {
      const { token, user } = await request(payload);
      login(token, user);
      router.replace("/");
    } catch (requestError) {
      setError(getErrorMessage(requestError, AUTH_FALLBACK_MESSAGE));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { error, clearError: () => setError(""), isSubmitting, submit };
}
