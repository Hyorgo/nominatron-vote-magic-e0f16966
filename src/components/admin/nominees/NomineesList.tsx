import { Card } from "@/components/ui/card";
import { Nominee } from "@/types/nominees";
import { NomineeCard } from "./NomineeCard";
import { EditNomineeForm } from "./EditNomineeForm";
import { Category } from "@/types/nominees";
import { useState } from "react";
import { useNominees } from "@/hooks/useNominees";
import { FilterBar } from "./filters/FilterBar";
import { logger } from '@/services/monitoring/logger';

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

  // Récupérer tous les nominés avec leurs informations de catégorie
  const allNominees = categories.flatMap(category => 
    category.nominees.map(nominee => ({
      ...nominee,
      categoryName: category.name,
      category_id: category.id
    }))
  );

  logger.info('Catégorie sélectionnée:', selectedCategory);
  logger.info('Nominés disponibles:', allNominees);

  // Filtrer les nominés par catégorie
  const categoryFilteredNominees = selectedCategory === "all" 
    ? allNominees 
    : allNominees.filter(nominee => {
        const matches = nominee.category_id === selectedCategory;
        logger.info(`Vérification du nominé ${nominee.name}:`, {
          nomineeId: nominee.id,
          nomineeCategoryId: nominee.category_id,
          selectedCategory,
          matches
        });
        return matches;
      });

  logger.info('Nominés filtrés par catégorie:', categoryFilteredNominees);

  // Appliquer les filtres de recherche et de tri
  const filteredNominees = filterAndSortNominees(categoryFilteredNominees);

  logger.info('Nominés filtrés et triés:', filteredNominees);

  const handleEdit = (nominee: Nominee) => {
    setSelectedNominee(nominee);
  };

  const handleCloseEdit = () => {
    setSelectedNominee(null);
  };

  const handleCategoryChange = (categoryId: string) => {
    logger.info('Changement de catégorie:', categoryId);
    setSelectedCategory(categoryId);
  };

  return (
    <Card className="p-4 space-y-4">
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

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