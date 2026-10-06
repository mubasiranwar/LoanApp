"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export const loansQueryKey = (userId) => ["loans", userId];

async function fetchLoans() {
  const response = await api.get("/loan");
  const loans = response.data?.data;

  if (!Array.isArray(loans)) {
    throw new Error("The server returned an invalid loans response.");
  }

  return loans;
}

export function useLoans() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: loansQueryKey(user?.id ?? "authenticated-user"),
    queryFn: fetchLoans,
    enabled: isAuthenticated && !isLoading,
  });
}

export function useCreateLoan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loan) => api.post("/loan", loan),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: loansQueryKey(user?.id ?? "authenticated-user"),
      }),
  });
}

export function useUpdateLoan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...loan }) => api.put(`/loan/${id}`, loan),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: loansQueryKey(user?.id ?? "authenticated-user"),
      }),
  });
}

export function useDeleteLoan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/loan/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: loansQueryKey(user?.id ?? "authenticated-user"),
      }),
  });
}
