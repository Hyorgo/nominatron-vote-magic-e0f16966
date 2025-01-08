import { useState, useEffect } from "react";
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
import { Trophy, PlusCircle, Save } from "lucide-react";
import { Category, Nominee } from "@/types/nominees";

interface NomineeFormProps {
  categories: Category[];
  onSubmit: (nominee: { name: string; description: string; category_id: string }) => void;
  initialValues?: Nominee;
}

export const NomineeForm = ({ categories, onSubmit, initialValues }: NomineeFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newNominee, setNewNominee] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialValues) {
      setNewNominee({
        name: initialValues.name,
        description: initialValues.description,
      });
      setSelectedCategory(initialValues.category_id || "");
    }
  }, [initialValues]);

  const handleSubmit = () => {
    if (!newNominee.name.trim() || !newNominee.description.trim() || !selectedCategory) return;
    
    onSubmit({
      ...newNominee,
      category_id: selectedCategory,
    });

    if (!initialValues) {
      setNewNominee({ name: "", description: "" });
      setSelectedCategory("");
    }
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
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gold" />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSubmit} className={initialValues ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}>
        {initialValues ? (
          <>
            <Save className="h-4 w-4 mr-2" />
            Mettre à jour le nominé
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter le nominé
          </>
        )}
      </Button>
    </div>
  );
};