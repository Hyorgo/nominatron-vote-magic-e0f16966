import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export const LogoDisplay = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <ImageWithFallback 
        src="/lovable-uploads/3045e74a-a51d-46bc-a29a-6de6b9d2ee54.png"
        alt="Sortir Lyon"
        className="h-24 w-auto object-contain p-2"
      />
    </Link>
  );
};