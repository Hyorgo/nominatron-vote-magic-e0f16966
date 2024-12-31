import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface LogoUploadFormProps {
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  hasFile: boolean;
}

export const LogoUploadForm = ({ 
  uploading, 
  onFileChange, 
  onUpload, 
  hasFile 
}: LogoUploadFormProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="max-w-xs"
        disabled={uploading}
      />
      <Button 
        onClick={onUpload} 
        disabled={!hasFile || uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Mettre à jour"
        )}
      </Button>
    </div>
  );
};