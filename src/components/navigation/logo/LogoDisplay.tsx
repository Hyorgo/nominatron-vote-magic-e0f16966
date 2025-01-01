import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export const LogoDisplay = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <ImageWithFallback 
        src="93271aaf-9e62-4558-8749-1976277221ad.png"
        bucket="logos"
        alt="Sortir Lyon"
        className="h-24 w-auto object-contain p-2"
      />
    </Link>
  );
};