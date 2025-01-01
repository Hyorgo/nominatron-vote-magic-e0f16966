import { useState } from "react";
import { Nominee } from "@/types/nominees";
import { logger } from '@/services/monitoring/logger';

export const useNominees = (onUpdate: () => void) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"name" | "date">("name");

  const filterAndSortNominees = (nominees: Nominee[]) => {
    logger.info('Filtering and sorting nominees', {
      searchTerm,
      sortOrder,
      totalNominees: nominees.length
    });

    let filtered = nominees;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = nominees.filter(
        nominee =>
          nominee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nominee.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Trier les nominés
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      }
      // Tri par date
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });

    logger.info('Filtered and sorted results', {
      filteredCount: filtered.length,
      sortedCount: sorted.length
    });

    return sorted;
  };

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    filterAndSortNominees,
  };
};