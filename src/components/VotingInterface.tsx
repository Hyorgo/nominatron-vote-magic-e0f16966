import { useState, useMemo } from "react";
import { useVoting } from "@/hooks/useVoting";
import { useCategories } from "@/hooks/useCategories";
import { VotingHeader } from "./voting/VotingHeader";
import { VotingDialog } from "./voting/VotingDialog";
import { VotingContent } from "./voting/VotingContent";
import { VotingCountdown } from "./voting/VotingCountdown";
import { LoadingState } from "./voting/LoadingState";
import { EmptyState } from "./voting/EmptyState";

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { isVotingOpen, selectedNominees, handleNomineeSelect, votingConfig, userEmail } = useVoting();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { categories, isLoading, fetchCategories } = useCategories();

  const currentCategoryData = useMemo(() => 
    categories[currentCategory], 
    [categories, currentCategory]
  );

  const handleCategoryChange = (index: number) => {
    setCurrentCategory(index);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!categories.length) {
    return <EmptyState />;
  }

  return (
    <div className="container max-w-7xl py-8 animate-fade-in">
      <VotingHeader 
        isVotingOpen={isVotingOpen}
        onOpenDialog={() => setDialogOpen(true)}
      />

      {votingConfig?.end_date && (
        <div className="mb-6">
          <VotingCountdown 
            endDate={new Date(votingConfig.end_date)}
            userEmail={userEmail}
          />
        </div>
      )}

      <VotingDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchCategories}
      />

      {isVotingOpen && currentCategoryData && (
        <VotingContent
          currentCategory={currentCategory}
          categories={categories}
          selectedNominees={selectedNominees}
          onCategoryChange={handleCategoryChange}
          onVote={handleNomineeSelect}
        />
      )}
    </div>
  );
};