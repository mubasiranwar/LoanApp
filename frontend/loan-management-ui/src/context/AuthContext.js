"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const handleUnauthorized = () => {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
      queryClient.clear();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    const storedToken =
      window.localStorage.getItem("token") ||
      window.localStorage.getItem("auth_token");

    if (!storedToken) {
      queueMicrotask(() => {
        if (active) setIsLoading(false);
      });
    } else {
      queueMicrotask(() => {
        if (active) setToken(storedToken);
      });
      api
        .get("/auth/me")
        .then((response) => {
          if (active) setUser(response.data.data);
        })
        .catch(() => {
          if (active) setUser(null);
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    }

    return () => {
      active = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [queryClient]);

  useEffect(() => {
    if (isLoading) return;

    if (token) {
      window.localStorage.setItem("token", token);
      window.localStorage.removeItem("auth_token");
    } else {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("auth_token");
    }
  }, [isLoading, token]);

  const login = useCallback((nextToken, userData = null) => {
    window.localStorage.setItem("token", nextToken);
    window.localStorage.removeItem("auth_token");
    setToken(nextToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
