import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { LogoPreview } from "./logo/LogoPreview";
import { LogoUploadForm } from "./logo/LogoUploadForm";

interface LogoManagerProps {
  currentLogo: string;
  onUpdate: () => void;
}

export const LogoManager = ({ currentLogo, onUpdate }: LogoManagerProps) => {
  const { selectedFile, uploading, handleFileChange, handleUpload } = useLogoUpload(onUpdate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Logo du site
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LogoPreview currentLogo={currentLogo} />
        <LogoUploadForm
          uploading={uploading}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          hasFile={!!selectedFile}
        />
      </CardContent>
    </Card>
  );
};