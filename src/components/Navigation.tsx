import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./navigation/Logo";
import { MobileMenuButton } from "./navigation/MobileMenuButton";
import { NavigationLinks } from "./navigation/NavigationLinks";

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
        <Logo logoUrl={logoUrl} />
        
        <MobileMenuButton 
          isOpen={isMenuOpen} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        />

        <NavigationLinks 
          links={links} 
          currentPath={location.pathname} 
        />

        {isMenuOpen && (
          <NavigationLinks 
            links={links} 
            currentPath={location.pathname} 
            isMobile={true}
            onLinkClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};