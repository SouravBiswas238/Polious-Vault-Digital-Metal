import { useQuery } from "@tanstack/react-query";
import { balanceApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export function useBalance() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["balance", user?._id],
    queryFn: balanceApi.get,
    enabled: !!user,
    refetchInterval: 8000,
    staleTime: 5000,
  });
}
