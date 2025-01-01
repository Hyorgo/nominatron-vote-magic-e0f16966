import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageWithFallback } from './image-with-fallback';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (url: string | null) => void;
  className?: string;
}

export const ImageUpload = ({ currentImage, onImageChange, className = '' }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadImage, deleteImage } = useImageUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      onImageChange(url);
    }
  };

  const handleDelete = async () => {
    if (currentImage) {
      const success = await deleteImage(currentImage);
      if (success) {
        onImageChange(null);
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImage && (
        <div className="relative w-32 h-32 mx-auto">
          <ImageWithFallback
            src={currentImage}
            alt="Image preview"
            type="profile"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              {currentImage ? "Changer l'image" : "Ajouter une image"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};