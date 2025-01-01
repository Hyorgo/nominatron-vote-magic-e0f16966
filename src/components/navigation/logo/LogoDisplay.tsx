import { Link } from "react-router-dom";

export const LogoDisplay = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <img 
        src="/lovable-uploads/93271aaf-9e62-4558-8749-1976277221ad.png"
        alt="Sortir Lyon"
        className="h-24 w-auto object-contain p-2"
      />
    </Link>
  );
};