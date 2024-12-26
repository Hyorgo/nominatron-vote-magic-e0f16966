import { QueryOptions } from "@tanstack/react-query";

export const useQueryConfig = <T>(key: string) => {
  const defaultConfig: Partial<QueryOptions<T>> = {
    staleTime: 30000, // 30 secondes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  };

  return defaultConfig;
};