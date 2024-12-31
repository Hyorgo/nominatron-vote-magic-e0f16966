import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Ticket, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/monitoring/logger";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerLogo, setHeaderLogo] = useState("");

  useEffect(() => {
    loadHeaderLogo();
    
    // Écouter les changements en temps réel
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: 'setting_name=eq.header_logo'
        },
        (payload) => {
          if (payload.new && payload.new.setting_value) {
            logger.info('Mise à jour du logo détectée:', payload.new.setting_value);
            setHeaderLogo(payload.new.setting_value);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadHeaderLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_name', 'header_logo')
        .single();
      
      if (error) {
        logger.error('Erreur lors du chargement du logo:', error);
        return;
      }
      
      if (data) {
        logger.info('Logo chargé avec succès:', data.setting_value);
        setHeaderLogo(data.setting_value);
      }
    } catch (error) {
      logger.error('Erreur inattendue lors du chargement du logo:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={headerLogo || "/placeholder.svg"}
              alt="Lyon d'Or" 
              className="h-16 w-auto object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/reserver"
              className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              <Ticket className="w-5 h-5" />
              <span>Réserver ma place</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-t border-border md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                to="/reserver"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                <Ticket className="w-5 h-5" />
                <span>Réserver ma place</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};