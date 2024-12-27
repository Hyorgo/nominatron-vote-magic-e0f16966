import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationLinksProps {
  links: Array<{ href: string; label: string }>;
  currentPath: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export const NavigationLinks = ({ 
  links, 
  currentPath, 
  isMobile = false,
  onLinkClick 
}: NavigationLinksProps) => {
  const baseClasses = "transition-colors hover:text-primary px-3 py-2 rounded-lg";
  const activeClasses = "text-primary font-medium bg-white/10";
  const inactiveClasses = "text-muted-foreground hover:bg-white/5";

  const linksList = (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onLinkClick}
          className={cn(
            baseClasses,
            currentPath === link.href ? activeClasses : inactiveClasses
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  if (isMobile) {
    return (
      <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg md:hidden border-b border-white/10">
        <div className="container py-4 flex flex-col space-y-1">
          {linksList}
        </div>
      </div>
    );
  }

  return <div className="hidden md:flex gap-6 text-sm">{linksList}</div>;
};