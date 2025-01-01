import { useState } from "react";
import { Nominee } from "@/types/nominees";
import { logger } from '@/services/monitoring/logger';

export const useNomineesFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"name" | "date">("name");

  const filterAndSortNominees = (nominees: Nominee[]) => {
    logger.info('Filtering and sorting nominees:', {
      searchTerm,
      sortOrder,
      totalNominees: nominees.length
    });

    return nominees
      .filter((nominee) => {
        const matchesSearch = 
          nominee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nominee.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        logger.info(`Filtering nominee ${nominee.name}:`, {
          nomineeId: nominee.id,
          matchesSearch
        });
        
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "name") {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    filterAndSortNominees,
  };
};