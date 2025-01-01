import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { Nominee } from "@/types/nominees";

interface NomineeCardProps {
  nominee: Nominee;
  onDelete: (id: string) => void;
  onEdit: (nominee: Nominee) => void;
}

export const NomineeCard = ({ nominee, onDelete, onEdit }: NomineeCardProps) => {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start gap-4">
        {nominee.image_url && (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={nominee.image_url}
              alt={nominee.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
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