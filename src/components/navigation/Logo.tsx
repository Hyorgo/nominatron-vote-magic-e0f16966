import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/monitoring/logger";
import LazyImage from "@/components/ui/lazy-image";

export const Logo = () => {
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHeaderLogo();
    
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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to="/" className="flex-shrink-0">
      <LazyImage 
        src={headerLogo || "/placeholder.svg"}
        alt="Lyon d'Or" 
        className="h-16 w-auto object-contain p-2" 
      />
    </Link>
  );
};