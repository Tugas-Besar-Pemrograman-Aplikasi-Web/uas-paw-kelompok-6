import { useCallback } from "react";
import { useFetch } from "./use-fetch";
import {
  getAgentStats,
  getPackagePerformance,
  getTouristStats,
} from "@/services/analytics.service";

/**
 * Hook untuk mengambil statistics agent
 */
export function useAgentStats() {
  const { data, isLoading, error, refetch } = useFetch(
    useCallback(() => getAgentStats(), []),
    { errorMessage: "Gagal mengambil data statistics" }
  );

  return { stats: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil package performance
 */
export function usePackagePerformance() {
  const { data, isLoading, error, refetch } = useFetch(
    useCallback(() => getPackagePerformance(), []),
    { errorMessage: "Gagal mengambil data performance" }
  );

  return { performance: data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil tourist statistics
 */
export function useTouristStats() {
  const { data, isLoading, error, refetch } = useFetch(
    useCallback(() => getTouristStats(), []),
    { errorMessage: "Gagal mengambil data statistics" }
  );

  return { stats: data, isLoading, error, refetch };
}
