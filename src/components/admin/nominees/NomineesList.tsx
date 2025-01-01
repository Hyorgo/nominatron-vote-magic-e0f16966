import { Card } from "@/components/ui/card";
import { Nominee } from "@/types/nominees";
import { SearchSortBar } from "./SearchSortBar";
import { NomineeCard } from "./NomineeCard";
import { useNominees } from "@/hooks/useNominees";
import { Category } from "@/types/nominees";
import { useState } from "react";
import { EditNomineeForm } from "./EditNomineeForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy } from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extraire tous les nominés de toutes les catégories
  const allNominees = categories.flatMap(category => {
    // Ajouter l'information de la catégorie à chaque nominé
    return category.nominees.map(nominee => ({
      ...nominee,
      categoryName: category.name // Ajouter le nom de la catégorie pour l'affichage
    }));
  });
  
  // Filtrer d'abord par catégorie si une catégorie est sélectionnée
  const categoryFilteredNominees = selectedCategory === "all" 
    ? allNominees 
    : allNominees.filter(nominee => {
        console.log('Nominee category:', nominee.category_id, 'Selected category:', selectedCategory);
        return nominee.category_id === selectedCategory;
      });

  // Ensuite appliquer les autres filtres (recherche et tri)
  const filteredNominees = filterAndSortNominees(categoryFilteredNominees);

  const handleEdit = (nominee: Nominee) => {
    setSelectedNominee(nominee);
  };

  const handleCloseEdit = () => {
    setSelectedNominee(null);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="w-full md:w-1/3">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  Toutes les catégories
                </div>
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gold" />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <SearchSortBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredNominees.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucun nominé ne correspond aux critères de recherche
          </p>
        ) : (
          filteredNominees.map((nominee) => (
            <NomineeCard
              key={nominee.id}
              nominee={nominee}
              onDelete={onDelete}
              onEdit={handleEdit}
            />
          ))
        )}
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