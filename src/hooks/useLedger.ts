import { useQuery } from "@tanstack/react-query";
import { fetchUserLedger } from "@/lib/api";
import { Transaction } from "@/types";
import { useAuth } from "@/components/auth/AuthContext";

/**
 * Custom hook to fetch and manage the user's ledger transactions.
 */
export function useLedger() {
  const { userId, isAuthenticated } = useAuth();

  return useQuery<Transaction[]>({
    queryKey: ['ledger', userId],
    queryFn: fetchUserLedger,
    enabled: isAuthenticated,
  });
}
