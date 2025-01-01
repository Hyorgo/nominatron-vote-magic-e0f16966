import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category, Nominee } from "@/types/nominees";
import { Loader2 } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";
import { NomineeFormFields } from "./NomineeFormFields";
import { useNomineeForm } from "@/hooks/useNomineeForm";

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
  onUpdate
}: EditNomineeFormProps) => {
  const {
    formData,
    isUploading,
    setIsUploading,
    isSubmitting,
    handleFormChange,
    handleSubmit
  } = useNomineeForm({ nominee, onUpdate, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le nominé</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <NomineeFormFields
            formData={formData}
            onFormChange={handleFormChange}
            categories={categories}
          />

          <ImageUploadField
            imageUrl={formData.image_url}
            nomineeName={formData.name}
            onImageUploaded={(url) => handleFormChange('image_url', url)}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              "Sauvegarder les modifications"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};