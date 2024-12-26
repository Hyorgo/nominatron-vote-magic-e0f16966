import { QueryOptions } from "@tanstack/react-query";

export const useQueryConfig = <T>(key: string): Partial<QueryOptions> => {
  return {
    retry: false,
    gcTime: 5 * 60 * 1000, // 5 minutes
  };
};