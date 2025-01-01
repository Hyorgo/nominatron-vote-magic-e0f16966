import { Card } from "@/components/ui/card";
import { Nominee } from "@/types/nominees";
import { SearchSortBar } from "./SearchSortBar";
import { NomineeCard } from "./NomineeCard";
import { useNominees } from "@/hooks/useNominees";
import { Category } from "@/types/nominees";

interface NomineesListProps {
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit?: (nominee: Nominee) => void;
}

export const NomineesList = ({ categories, onDelete, onEdit }: NomineesListProps) => {
  const {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    filterAndSortNominees,
  } = useNominees(() => {
    console.log("Callback executed");
  });

  // Extraire tous les nominés de toutes les catégories de manière sécurisée
  const allNominees = categories?.flatMap(category => category.nominees || []) || [];
  const filteredNominees = filterAndSortNominees(allNominees);

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
            onEdit={onEdit || (() => {})}
          />
        ))}
      </div>
    </Card>
  );
};