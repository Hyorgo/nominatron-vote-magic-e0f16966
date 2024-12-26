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
import { Category } from "@/types/nominees";

interface AddNomineeFormProps {
  categories: Category[];
  onSubmit: (nominee: { name: string; description: string; category_id: string }) => void;
}

export const AddNomineeForm = ({ categories, onSubmit }: AddNomineeFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !categoryId) return;

    onSubmit({
      name,
      description,
      category_id: categoryId,
    });

    // Reset form
    setName("");
    setDescription("");
    setCategoryId("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Nom du nominé"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Select value={categoryId} onValueChange={setCategoryId} required>
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
      </div>
      <Textarea
        placeholder="Description du nominé"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un nominé
      </Button>
    </form>
  );
};