import { useQuery } from "@tanstack/react-query";
import { fetchEnergyTelemetry } from "@/lib/api";
import { EnergyData } from "@/types";

/**
 * Custom hook to fetch and manage real-time energy telemetry.
 * Uses a short staleTime to ensure data freshness for marketplace operations.
 */
export function useTelemetry() {
  return useQuery<EnergyData | null>({
    queryKey: ['telemetry'],
    queryFn: fetchEnergyTelemetry,
    staleTime: 5000, // 5 seconds freshness window
    refetchInterval: 15000, // Background poll every 15 seconds
  });
}
