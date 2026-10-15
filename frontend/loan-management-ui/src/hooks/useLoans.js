"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { loanService } from "@/services/loan.service";

const LOANS_QUERY_KEY = ["loans"];
const PAGE_SIZE = 10;

export function useLoans(page) {
  const { user, isAuthenticated, isLoading } = useAuth();
  return useQuery({
    // Keyed by user so one account never sees another account's cached list.
    queryKey: [...LOANS_QUERY_KEY, user?.id, page, PAGE_SIZE],
    queryFn: () => loanService.getAll({ page, limit: PAGE_SIZE }),
    enabled: isAuthenticated && !isLoading,
  });
}

// Every mutation refreshes the list afterwards - even when it fails, because a
// failure usually means our copy was stale (e.g. an admin just decided the loan).
function useLoanMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY }),
  });
}

export const useCreateLoan = () => useLoanMutation(loanService.create);

export const useUpdateLoan = () =>
  useLoanMutation(({ id, ...payload }) => loanService.update(id, payload));

export const useDeleteLoan = () => useLoanMutation(loanService.remove);

// Admin only: approve / reject.
export const useUpdateLoanStatus = () =>
  useLoanMutation(({ id, status }) => loanService.updateStatus(id, status));
