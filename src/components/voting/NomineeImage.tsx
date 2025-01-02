import { cn } from "@/lib/utils";
import { getNomineeImageUrl, shouldUseBlackBackground } from "./utils/nomineeImageUtils";

interface NomineeImageProps {
  nomineeName: string;
  imageUrl?: string;
  isSelected: boolean;
}

export const NomineeImage = ({ nomineeName, imageUrl, isSelected }: NomineeImageProps) => {
  console.log('NomineeImage - Nom reçu:', nomineeName);
  console.log('NomineeImage - URL image reçue:', imageUrl);
  
  // Si on a une URL d'image directe, on l'utilise en priorité
  if (imageUrl) {
    console.log('NomineeImage - Utilisation de l\'URL directe:', imageUrl);
    return (
      <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={nomineeName}
          className={cn(
            "object-contain w-full h-full transition-transform duration-500",
            "group-hover:scale-110",
            isSelected && "brightness-110"
          )}
          onError={(e) => {
            console.error('Erreur de chargement de l\'image:', imageUrl);
            console.error('Pour le nominé:', nomineeName);
            console.error('Erreur complète:', e);
          }}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
        )}
      </div>
    );
  }

  // Sinon, on essaie de trouver l'image dans notre mapping
  const mappedImageUrl = getNomineeImageUrl(nomineeName);
  console.log('NomineeImage - URL mappée trouvée:', mappedImageUrl);
  
  if (!mappedImageUrl) {
    console.log('NomineeImage - Pas d\'URL d\'image, ne rien afficher');
    return null;
  }

  const useBlackBg = shouldUseBlackBackground(nomineeName);
  console.log('NomineeImage - Fond noir:', useBlackBg);

  return (
    <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-lg">
      <img
        src={mappedImageUrl}
        alt={nomineeName}
        className={cn(
          "object-contain w-full h-full transition-transform duration-500",
          "group-hover:scale-110",
          isSelected && "brightness-110",
          useBlackBg && "bg-black p-4"
        )}
        onError={(e) => {
          console.error('Erreur de chargement de l\'image:', mappedImageUrl);
          console.error('Pour le nominé:', nomineeName);
          console.error('Erreur complète:', e);
          console.error('Type d\'erreur:', e.type);
          console.error('Message d\'erreur:', (e.target as HTMLImageElement).src);
        }}
      />
      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
      )}
    </div>
  );
};