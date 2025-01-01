import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export const LogoDisplay = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <ImageWithFallback 
        src="/lovable-uploads/98b679b9-70a7-4a52-8000-8e3e86a516c7.png"
        alt="Sortir Lyon"
        className="h-24 w-auto object-contain p-2"
      />
    </Link>
  );
};