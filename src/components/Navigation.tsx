import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./navigation/Logo";
import { MobileMenuButton } from "./navigation/MobileMenuButton";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState("/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      console.log("Tentative de chargement du logo...");
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_name', 'header_logo')
        .maybeSingle();
      
      if (error) {
        console.error('Erreur lors du chargement du logo:', error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger le logo. Utilisation du logo par défaut.",
        });
        return;
      }
      
      if (data) {
        console.log("Logo chargé avec succès:", data.setting_value);
        setLogoUrl(data.setting_value);
      }
    } catch (error) {
      console.error('Erreur inattendue lors du chargement du logo:', error);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur est survenue lors du chargement du logo.",
      });
    }
  };

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/reserver", label: "Réserver mes places" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur-md backdrop-saturate-150">
      <div className="container flex h-16 items-center justify-between px-4">
        <Logo logoUrl={logoUrl} />
        
        <div className="md:hidden">
          <MobileMenuButton 
            isOpen={isMenuOpen} 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
          />
        </div>

        <NavigationLinks 
          links={links} 
          currentPath={location.pathname} 
          className="hidden md:flex"
        />

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 w-full bg-background/95 backdrop-blur-md backdrop-saturate-150 border-b border-white/10 md:hidden">
            <div className="container px-4">
              <NavigationLinks 
                links={links} 
                currentPath={location.pathname} 
                isMobile={true}
                onLinkClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};