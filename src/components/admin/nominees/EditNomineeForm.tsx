import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy } from "lucide-react";
import { Category, Nominee } from "@/types/nominees";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface EditNomineeFormProps {
  nominee: Nominee;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditNomineeForm = ({
  nominee,
  categories,
  isOpen,
  onClose,
  onUpdate,
}: EditNomineeFormProps) => {
  const [formData, setFormData] = useState({
    name: nominee.name,
    description: nominee.description,
    category_id: nominee.category_id || "",
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      logger.info('Tentative de mise à jour du nominé:', { id: nominee.id, ...formData });
      const { error } = await supabase
        .from("nominees")
        .update({
          name: formData.name,
          description: formData.description,
          category_id: formData.category_id,
        })
        .eq("id", nominee.id);

      if (error) {
        logger.error('Erreur lors de la mise à jour du nominé:', error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "Nominé mis à jour avec succès",
      });

      onUpdate();
      onClose();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du nominé:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le nominé",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le nominé</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nom du nominé"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            placeholder="Description du nominé"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Select
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gold" />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit}>Mettre à jour</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};