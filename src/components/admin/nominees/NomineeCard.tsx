import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { Nominee } from "@/types/nominees";
import LazyImage from "@/components/ui/lazy-image";
import { logger } from '@/services/monitoring/logger';

interface NomineeCardProps {
  nominee: Nominee;
  onDelete: (id: string) => void;
  onEdit: (nominee: Nominee) => void;
}

export const NomineeCard = ({ nominee, onDelete, onEdit }: NomineeCardProps) => {
  const handleImageError = () => {
    logger.error('Erreur de chargement de l\'image pour le nominé:', {
      nomineeId: nominee.id,
      nomineeName: nominee.name,
      imageUrl: nominee.image_url
    });
  };

  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold">{nominee.name}</h3>
          <p className="text-sm text-muted-foreground">{nominee.description}</p>
          {nominee.image_url && (
            <div className="mt-2">
              <LazyImage
                src={nominee.image_url}
                alt={nominee.name}
                className="h-32 w-full object-cover rounded-md"
                onError={handleImageError}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(nominee)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(nominee.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};