import { Tabs } from "@/components/ui/tabs";
import { CategoryTabs } from "../CategoryTabs";
import { Category } from "@/types/nominees";
import { VotingTitle } from "./VotingTitle";
import { NomineesList } from "./NomineesList";
import { FinishVotingButton } from "../FinishVotingButton";

interface VotingContainerProps {
  categories: Category[];
  currentCategory: Category;
  selectedNominees: Record<string, string>;
  onTabChange: (categoryId: string) => void;
  onVote: (nomineeId: string) => Promise<void>;
}

export const VotingContainer = ({
  categories,
  currentCategory,
  selectedNominees,
  onTabChange,
  onVote,
}: VotingContainerProps) => {
  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center space-y-6">
        <VotingTitle />

        <Tabs
          value={currentCategory.id}
          onValueChange={onTabChange}
          className="w-full"
        >
          <CategoryTabs 
            categories={categories} 
            currentCategory={currentCategory.id}
            selectedNominees={selectedNominees}
          />
        </Tabs>
      </div>

      <NomineesList
        category={currentCategory}
        selectedNominees={selectedNominees}
        onVote={onVote}
      />

      <FinishVotingButton 
        selectedNominees={selectedNominees}
        categories={categories}
      />
    </div>
  );
};