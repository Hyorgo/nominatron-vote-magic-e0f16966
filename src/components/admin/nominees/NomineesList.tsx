import { Nominee, Category } from "@/types/nominees";
import { useState } from "react";
import { useNominees } from "@/hooks/useNominees";
import { EditNomineeForm } from "./EditNomineeForm";
import { logger } from '@/services/monitoring/logger';
import { NomineeFilters } from "./filters/NomineeFilters";
import { FilteredNominees } from "./filters/FilteredNominees";

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
      categoryName: category.name
    }))
  );

  // Filtrer les nominés par catégorie
  const categoryFilteredNominees = selectedCategory === "all" 
    ? allNominees 
    : allNominees.filter(nominee => nominee.category_id === selectedCategory);

  // Appliquer les filtres de recherche et de tri
  const filteredNominees = filterAndSortNominees(categoryFilteredNominees);

  logger.info('Filtered nominees:', {
    totalNominees: allNominees.length,
    selectedCategory,
    filteredCount: filteredNominees.length,
    nominees: filteredNominees.map(n => ({
      id: n.id,
      name: n.name,
      categoryId: n.category_id,
      matches: n.category_id === selectedCategory
    }))
  });

  const handleEdit = (nominee: Nominee) => {
    setSelectedNominee(nominee);
  };

  const handleCloseEdit = () => {
    setSelectedNominee(null);
  };

  return (
    <div className="space-y-4">
      <NomineeFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <FilteredNominees
        nominees={filteredNominees}
        onDelete={onDelete}
        onEdit={handleEdit}
      />

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
    </div>
  );
};