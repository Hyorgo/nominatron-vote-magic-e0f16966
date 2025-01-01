import { Nominee } from "@/types/nominees";
import { NomineeCard } from "../NomineeCard";
import { logger } from '@/services/monitoring/logger';

interface FilteredNomineesProps {
  nominees: Nominee[];
  onDelete: (id: string) => void;
  onEdit: (nominee: Nominee) => void;
}

export const FilteredNominees = ({ 
  nominees, 
  onDelete, 
  onEdit 
}: FilteredNomineesProps) => {
  if (nominees.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Aucun nominé ne correspond aux critères de recherche
      </p>
    );
  }

  logger.info('Affichage des nominés filtrés:', {
    count: nominees.length,
    nominees: nominees.map(n => ({
      id: n.id,
      name: n.name,
      categoryName: n.categoryName
    }))
  });

  return (
    <div className="space-y-2">
      {nominees.map((nominee) => (
        <NomineeCard
          key={nominee.id}
          nominee={nominee}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};