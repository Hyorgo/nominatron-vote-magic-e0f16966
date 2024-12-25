import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/categories", label: "Catégories" },
    { href: "/reserver", label: "Réserver sa place" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                location.pathname === link.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};