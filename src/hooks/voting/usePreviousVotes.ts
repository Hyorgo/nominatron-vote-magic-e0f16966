import { useEffect } from "react";

export const usePreviousVotes = (
  userEmail: string | undefined | null,
  loadPreviousVotes: (email: string) => Promise<void>
) => {
  useEffect(() => {
    if (userEmail) {
      loadPreviousVotes(userEmail);
    }
  }, [userEmail, loadPreviousVotes]);
};