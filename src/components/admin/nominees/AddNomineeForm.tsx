import { NomineeForm } from "./NomineeForm";
import { Category, Nominee } from "@/types/nominees";

interface AddNomineeFormProps {
  categories: Category[];
  onSubmit: (nominee: { name: string; description: string; category_id: string }) => void;
  initialValues?: Nominee;
}

export const AddNomineeForm = ({ categories, onSubmit, initialValues }: AddNomineeFormProps) => {
  return (
    <NomineeForm 
      categories={categories} 
      onSubmit={onSubmit}
      initialValues={initialValues}
    />
  );
};