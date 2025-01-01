import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { Nominee } from "@/types/nominees";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { logger } from '@/services/monitoring/logger';

interface NomineeCardProps {
  nominee: Nominee;
  onDelete: (id: string) => void;
  onEdit: (nominee: Nominee) => void;
}

export const NomineeCard = ({ nominee, onDelete, onEdit }: NomineeCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error('Erreur de chargement de l\'image', {
      nomineeId: nominee.id,
      imageUrl: nominee.image_url
    });
    e.currentTarget.src = '/placeholder.svg';
    e.currentTarget.className = 'w-full h-full object-contain p-4';
  };

  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start gap-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
          <ImageWithFallback
            src={nominee.image_url || ''}
            alt={nominee.name}
            type="profile"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{nominee.name}</h3>
          <p className="text-sm text-muted-foreground">{nominee.description}</p>
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