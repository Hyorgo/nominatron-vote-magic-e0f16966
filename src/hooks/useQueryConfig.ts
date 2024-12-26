import { QueryOptions } from "@tanstack/react-query";

export const useQueryConfig = <T>(key: string): Partial<QueryOptions<T, Error, T>> => {
  return {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  };
};