import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CategoryFormProps {
  newCategoryName: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
}

export const CategoryForm = ({
  newCategoryName,
  onNameChange,
  onSubmit,
}: CategoryFormProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Nom de la nouvelle catégorie"
        value={newCategoryName}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Button onClick={onSubmit}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter
      </Button>
    </div>
  );
};