import { Link } from "react-router-dom";

export const LogoDisplay = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <img 
        src="/lovable-uploads/42443689-949d-4d8b-8c49-c12f23c454e5.png"
        alt="Sortir Lyon"
        className="h-24 w-auto object-contain p-2"
      />
    </Link>
  );
};