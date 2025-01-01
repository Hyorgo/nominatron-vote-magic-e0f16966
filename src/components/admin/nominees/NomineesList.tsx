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
  const allNominees = categories.flatMap(category => {
    logger.info(`Traitement de la catégorie ${category.name}:`, {
      categoryId: category.id,
      nomineesCount: category.nominees.length,
      nominees: category.nominees.map(n => ({
        id: n.id,
        name: n.name,
        categoryId: n.category_id
      }))
    });
    
    return category.nominees.map(nominee => {
      logger.info(`Nominé trouvé dans ${category.name}:`, {
        nomineeName: nominee.name,
        nomineeId: nominee.id,
        categoryId: category.id,
        nomineeCategoryId: nominee.category_id
      });
      
      return {
        ...nominee,
        categoryName: category.name,
        category_id: category.id
      };
    });
  });

  // Filtrer les nominés par catégorie
  const categoryFilteredNominees = selectedCategory === "all" 
    ? allNominees 
    : allNominees.filter(nominee => {
        const matches = nominee.category_id === selectedCategory;
        logger.info(`Filtrage du nominé ${nominee.name}:`, {
          nomineeId: nominee.id,
          nomineeCategoryId: nominee.category_id,
          selectedCategory,
          matches,
          categoryName: nominee.categoryName,
          comparison: `${nominee.category_id} === ${selectedCategory}`
        });
        return matches;
      });

  logger.info('Résultats du filtrage:', {
    selectedCategory,
    filteredCount: categoryFilteredNominees.length,
    availableCategories: categories.map(c => ({
      id: c.id,
      name: c.name,
      nomineesCount: c.nominees.length
    })),
    nominees: categoryFilteredNominees.map(n => ({
      name: n.name,
      category: n.categoryName,
      categoryId: n.category_id
    }))
  });

  // Appliquer les filtres de recherche et de tri
  const filteredNominees = filterAndSortNominees(categoryFilteredNominees);

  const handleEdit = (nominee: Nominee) => {
    setSelectedNominee(nominee);
  };

  const handleCloseEdit = () => {
    setSelectedNominee(null);
  };

  const handleCategoryChange = (categoryId: string) => {
    logger.info('Changement de catégorie:', {
      previousCategory: selectedCategory,
      newCategory: categoryId,
      availableCategories: categories.map(c => ({
        id: c.id,
        name: c.name
      }))
    });
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