import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AddNomineeForm } from "./AddNomineeForm";
import type { Category, Nominee } from "@/types/nominees";

interface EditNomineeDialogProps {
  nominee: Nominee | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (nominee: Nominee) => void;
}

export const EditNomineeDialog = ({
  nominee,
  categories,
  onClose,
  onSubmit,
}: EditNomineeDialogProps) => {
  if (!nominee) return null;

  return (
    <Dialog open={!!nominee} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <AddNomineeForm
          categories={categories}
          onSubmit={(values) => onSubmit({ ...values, id: nominee.id, image_url: nominee.image_url })}
          initialValues={nominee}
        />
      </DialogContent>
    </Dialog>
  );
};