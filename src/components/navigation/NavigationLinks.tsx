import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationLinksProps {
  links: Array<{ href: string; label: string }>;
  currentPath: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
  className?: string;
}

export const NavigationLinks = ({ 
  links, 
  currentPath, 
  isMobile = false,
  onLinkClick,
  className 
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
      <div className="py-4 flex flex-col space-y-1">
        {linksList}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {linksList}
    </div>
  );
};