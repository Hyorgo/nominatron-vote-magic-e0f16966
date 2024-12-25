import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Category } from "../../../types/nominees";

interface NomineeFormProps {
  categories: Category[];
  onSubmit: (nominee: { name: string; description: string; category_id: string }) => void;
}

export const NomineeForm = ({ categories, onSubmit }: NomineeFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newNominee, setNewNominee] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!newNominee.name.trim() || !newNominee.description.trim() || !selectedCategory) return;
    
    onSubmit({
      ...newNominee,
      category_id: selectedCategory,
    });

    setNewNominee({ name: "", description: "" });
    setSelectedCategory("");
  };

  return (
    <div className="grid gap-4 mb-4">
      <Input
        placeholder="Nom du nominé"
        value={newNominee.name}
        onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
      />
      
      <Textarea
        placeholder="Description du nominé"
        value={newNominee.description}
        onChange={(e) => setNewNominee({ ...newNominee, description: e.target.value })}
      />
      
      <Select
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSubmit}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter le nominé
      </Button>
    </div>
  );
};