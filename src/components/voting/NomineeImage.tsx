import { cn } from "@/lib/utils";
import { getNomineeImageUrl, shouldUseBlackBackground } from "./utils/nomineeImageUtils";

interface NomineeImageProps {
  nomineeName: string;
  imageUrl?: string;
  isSelected: boolean;
}

export const NomineeImage = ({ nomineeName, imageUrl, isSelected }: NomineeImageProps) => {
  const finalImageUrl = getNomineeImageUrl(nomineeName, imageUrl);
  const useBlackBg = shouldUseBlackBackground(nomineeName);

  if (!finalImageUrl) return null;

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
      />
      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
      )}
    </div>
  );
};