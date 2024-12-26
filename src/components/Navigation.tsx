import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState("/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_name', 'header_logo')
      .single();
    
    if (data) {
      setLogoUrl(data.setting_value);
    }
  };

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/reserver", label: "Réserver mes places" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-white/5">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex-shrink-0">
          <img 
            src={logoUrl}
            alt="Lyon d'Or" 
            className="h-8 sm:h-12 w-auto"
          />
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "transition-colors hover:text-primary px-3 py-2 rounded-lg",
                location.pathname === link.href
                  ? "text-primary font-medium bg-white/10"
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg md:hidden border-b border-white/10">
            <div className="container py-4 flex flex-col space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "transition-colors hover:text-primary px-4 py-3 rounded-lg",
                    location.pathname === link.href
                      ? "text-primary font-medium bg-white/10"
                      : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};