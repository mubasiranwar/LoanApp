"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import {
  clearToken,
  getToken,
  saveToken,
  UNAUTHORIZED_EVENT,
} from "@/services/session";
import { USER_ROLE } from "@/constants/userRole";

const AuthContext = createContext(null);

// The one place that asks the API "who is logged in?" (used once, on page load).
async function fetchSessionUser() {
  if (!getToken()) return null;
  try {
    return await authService.getCurrentUser();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // The one place that ends a session: used by the Log out button AND by the
  // 401 handler below. (React Compiler is on, so no useCallback/useMemo needed.)
  function logout() {
    clearToken();
    setUser(null);
    queryClient.clear();
  }

  // The one place that starts a session: after a successful login/signup.
  function login(token, nextUser) {
    saveToken(token);
    setUser(nextUser);
  }

  // Restore the session when the app loads.
  useEffect(() => {
    let active = true;
    fetchSessionUser().then((sessionUser) => {
      if (!active) return;
      setUser(sessionUser);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // The API said 401 (expired/invalid token) -> same logout as the button.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  });

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === USER_ROLE.ADMIN,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
