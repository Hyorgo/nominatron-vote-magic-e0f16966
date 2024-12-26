import { QueryOptions } from "@tanstack/react-query";

export const useQueryConfig = <T>(key: string) => {
  const defaultConfig: Partial<QueryOptions<T>> = {
    gcTime: 5 * 60 * 1000, // 5 minutes
  };

  return defaultConfig;
};