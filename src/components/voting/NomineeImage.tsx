import { cn } from "@/lib/utils";
import { getNomineeImageUrl, shouldUseBlackBackground } from "./utils/nomineeImageUtils";

interface NomineeImageProps {
  nomineeName: string;
  imageUrl?: string;
  isSelected: boolean;
}

export const NomineeImage = ({ nomineeName, imageUrl, isSelected }: NomineeImageProps) => {
  console.log('NomineeImage - Nom reçu:', nomineeName);
  const finalImageUrl = getNomineeImageUrl(nomineeName, imageUrl);
  console.log('NomineeImage - URL finale:', finalImageUrl);
  const useBlackBg = shouldUseBlackBackground(nomineeName);
  console.log('NomineeImage - Fond noir:', useBlackBg);

  if (!finalImageUrl) {
    console.log('NomineeImage - Pas d\'URL d\'image, ne rien afficher');
    return null;
  }

  return (
    <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-lg">
      <img
        src={finalImageUrl}
        alt={nomineeName}
        className={cn(
          "object-contain w-full h-full transition-transform duration-500",
          "group-hover:scale-110",
          isSelected && "brightness-110",
          useBlackBg && "bg-black p-4"
        )}
        onError={(e) => {
          console.error('Erreur de chargement de l\'image:', finalImageUrl);
          console.error('Pour le nominé:', nomineeName);
          console.error('Erreur complète:', e);
        }}
      />
      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
      )}
    </div>
  );
};