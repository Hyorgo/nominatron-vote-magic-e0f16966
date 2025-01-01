import { useImageUpload } from "./hooks/useImageUpload";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadHandlerProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export const ImageUploadHandler = ({ onImageUploaded }: ImageUploadHandlerProps) => {
  const { isUploading, uploadImage } = useImageUpload();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { publicUrl, error } = await uploadImage(file);
    
    if (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de télécharger l'image",
        variant: "destructive"
      });
      return;
    }

    if (publicUrl) {
      onImageUploaded(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
      id="image-upload-edit"
    />
  );
};