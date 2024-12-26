import { QueryOptions } from "@tanstack/react-query";

export const useQueryConfig = <T>(key: string): Partial<QueryOptions<T, Error, T>> => {
  return {
    retry: false,
    refetchOnMount: false,
  };
};