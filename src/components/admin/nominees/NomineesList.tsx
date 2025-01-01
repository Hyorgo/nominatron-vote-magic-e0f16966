import { Card } from "@/components/ui/card";
import { Nominee } from "@/types/nominees";
import { SearchSortBar } from "./SearchSortBar";
import { NomineeCard } from "./NomineeCard";
import { useNominees } from "@/hooks/useNominees";
import { Category } from "@/types/nominees";
import { useState } from "react";
import { EditNomineeForm } from "./EditNomineeForm";

interface NomineesListProps {
  categories: Category[];
  onDelete: (id: string) => void;
}

export const NomineesList = ({ categories, onDelete }: NomineesListProps) => {
  const {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    filterAndSortNominees,
  } = useNominees(() => {});

  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);

  // Extraire tous les nominés de toutes les catégories
  const allNominees = categories.flatMap(category => category.nominees);
  const filteredNominees = filterAndSortNominees(allNominees);

  const handleEdit = (nominee: Nominee) => {
    setSelectedNominee(nominee);
  };

  const handleCloseEdit = () => {
    setSelectedNominee(null);
  };

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
            onDelete={onDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {selectedNominee && (
        <EditNomineeForm
          nominee={selectedNominee}
          categories={categories}
          isOpen={!!selectedNominee}
          onClose={handleCloseEdit}
          onUpdate={() => {
            handleCloseEdit();
            window.location.reload();
          }}
        />
      )}
    </Card>
  );
};