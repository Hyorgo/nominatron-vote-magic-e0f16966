import { useVotingConfig } from "./voting/useVotingConfig";
import { useVotingSession } from "./voting/useVotingSession";
import { useVoteManagement } from "./voting/useVoteManagement";
import { useEffect } from "react";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useVotingSession();
  const { selectedNominees, handleNomineeSelect, loadPreviousVotes } = useVoteManagement(userEmail, isVotingOpen);

  useEffect(() => {
    if (userEmail) {
      loadPreviousVotes(userEmail);
    }
  }, [userEmail]);

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};