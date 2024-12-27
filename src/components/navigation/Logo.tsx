import { Link } from "react-router-dom";

export const Logo = ({ logoUrl }: { logoUrl: string }) => {
  return (
    <Link to="/" className="flex-shrink-0 relative group">
      <div className="absolute -inset-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 blur-2xl bg-primary/60" />
        <div className="absolute inset-0 blur-3xl bg-[#FFD700]/40" />
      </div>
      <img 
        src={logoUrl}
        alt="Lyon d'Or" 
        className="h-8 sm:h-12 w-auto relative"
      />
    </Link>
  );
};