import { useVoting } from "@/hooks/useVoting";
import { useCategories } from "@/hooks/useCategories";
import { VotingHeader } from "./voting/VotingHeader";
import { VotingDialog } from "./voting/VotingDialog";
import { VotingContent } from "./voting/VotingContent";
import { VotingCountdown } from "./voting/VotingCountdown";
import { LoadingState } from "./voting/LoadingState";
import { EmptyState } from "./voting/EmptyState";
import { useState, useMemo } from "react";

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { isVotingOpen, selectedNominees, handleNomineeSelect, votingConfig, userEmail } = useVoting();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { categories, isLoading, fetchCategories } = useCategories();

  const currentCategoryData = useMemo(() => 
    categories && categories.length > 0 ? categories[currentCategory] : null, 
    [categories, currentCategory]
  );

  const handleCategoryChange = (index: number) => {
    if (categories && categories.length > index) {
      setCurrentCategory(index);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!categories || categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container max-w-7xl py-12 sm:py-16 animate-fade-in">
      <VotingHeader 
        isVotingOpen={isVotingOpen}
        onOpenDialog={() => setDialogOpen(true)}
        userEmail={userEmail}
      />

      {votingConfig?.end_date && (
        <div className="mb-8 sm:mb-12">
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