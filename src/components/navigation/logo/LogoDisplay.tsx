import { Link } from "react-router-dom";
import LazyImage from "@/components/ui/lazy-image";

interface LogoDisplayProps {
  logoUrl: string | null;
}

export const LogoDisplay = ({ logoUrl }: LogoDisplayProps) => {
  return (
    <Link to="/" className="flex-shrink-0">
      <LazyImage 
        src={logoUrl || "/placeholder.svg"}
        alt="Lyon d'Or" 
        className="h-16 w-auto object-contain p-2" 
      />
    </Link>
  );
};