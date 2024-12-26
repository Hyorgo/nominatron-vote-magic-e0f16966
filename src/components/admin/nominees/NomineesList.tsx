import { Card } from "@/components/ui/card";
import { Nominee } from "@/types/nominees";
import { SearchSortBar } from "./SearchSortBar";
import { NomineeCard } from "./NomineeCard";
import { useNominees } from "@/hooks/useNominees";

interface NomineesListProps {
  nominees: Nominee[];
  onUpdate: () => void;
  onEdit: (nominee: Nominee) => void;
}

export const NomineesList = ({ nominees, onUpdate, onEdit }: NomineesListProps) => {
  const {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    handleDelete,
    filterAndSortNominees,
  } = useNominees(onUpdate);

  const filteredNominees = filterAndSortNominees(nominees);

  return (
    <Card className="p-4 space-y-4">
      <SearchSortBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
      <div className="space-y-2">
        {filteredNominees.map((nominee) => (
          <NomineeCard
            key={nominee.id}
            nominee={nominee}
            onDelete={handleDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </Card>
  );
};