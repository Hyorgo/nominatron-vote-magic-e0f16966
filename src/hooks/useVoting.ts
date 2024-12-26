import { useVotingConfig } from "./voting/useVotingConfig";
import { useVoteManagement } from "./voting/useVoteManagement";
import { useEmailSession } from "./voting/useEmailSession";
import { usePreviousVotes } from "./voting/usePreviousVotes";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const { selectedNominees, handleNomineeSelect, loadPreviousVotes } = useVoteManagement(
    userEmail || undefined,
    isVotingOpen
  );

  usePreviousVotes(userEmail, loadPreviousVotes);

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};