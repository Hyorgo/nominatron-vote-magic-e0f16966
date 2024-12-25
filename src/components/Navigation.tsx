import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Navigation = () => {
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState("/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png");

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
    { href: "/reserver", label: "Réserver ma place" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-white/5">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <img 
            src={logoUrl}
            alt="Sortir Lyon x Sixtynine Event" 
            className="h-12"
          />
        </Link>
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