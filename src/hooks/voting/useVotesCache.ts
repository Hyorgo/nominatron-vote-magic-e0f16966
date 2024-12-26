import { useQueryClient } from "@tanstack/react-query";

export const useVotesCache = (userEmail: string | undefined | null) => {
  const queryClient = useQueryClient();

  const updateVoteCache = (categoryId: string, nomineeId: string) => {
    queryClient.setQueryData(['previousVotes', userEmail], (oldData: any) => ({
      ...oldData,
      [categoryId]: nomineeId,
    }));
  };

  const invalidateVoteCache = () => {
    if (userEmail) {
      queryClient.invalidateQueries({ 
        queryKey: ['previousVotes', userEmail],
        exact: true 
      });
    }
  };

  return {
    updateVoteCache,
    invalidateVoteCache,
  };
};