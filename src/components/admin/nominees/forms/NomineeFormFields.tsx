import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types/nominees";

interface NomineeFormFieldsProps {
  formData: {
    name: string;
    description: string;
    category_id: string;
  };
  onFormChange: (field: string, value: string) => void;
  categories: Category[];
}

export const NomineeFormFields = ({
  formData,
  onFormChange,
  categories
}: NomineeFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Input
          placeholder="Nom du nominé"
          value={formData.name}
          onChange={(e) => onFormChange('name', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Textarea
          placeholder="Description du nominé"
          value={formData.description}
          onChange={(e) => onFormChange('description', e.target.value)}
        />
      </div>
      
      <Select
        value={formData.category_id}
        onValueChange={(value) => onFormChange('category_id', value)}
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
    </>
  );
};