import { Link } from "react-router-dom";

export const LogoDisplay = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <img 
        src="/lovable-uploads/780999f0-d95d-41a7-bc28-00565fb1cc46.png"
        alt="Lyon d'Or"
        className="h-16 w-auto object-contain p-2"
      />
    </Link>
  );
};