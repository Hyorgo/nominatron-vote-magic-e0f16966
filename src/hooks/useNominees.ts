import { useNomineesFilters } from "./nominees/useNomineesFilters";
import { useNomineesCrud } from "./nominees/useNomineesCrud";
import { useNomineesQuery } from "./nominees/useNomineesQuery";

export const useNominees = (onUpdate: () => void) => {
  const {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    filterAndSortNominees,
  } = useNomineesFilters();

  const { handleDelete, handleSubmit } = useNomineesCrud(onUpdate);
  const { data: nominees = [] } = useNomineesQuery();

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    handleDelete,
    handleSubmit,
    filterAndSortNominees,
    nominees,
  };
};