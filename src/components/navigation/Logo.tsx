import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/monitoring/logger";
import LazyImage from "@/components/ui/lazy-image";
import { Loader2 } from "lucide-react";

export const Logo = () => {
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHeaderLogo();
    
    // Créer un canal avec un ID unique
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'setting_name=eq.header_logo'
        },
        (payload) => {
          if (payload.new && 'setting_value' in payload.new) {
            logger.info('Mise à jour du logo détectée:', payload.new.setting_value);
            setHeaderLogo(payload.new.setting_value as string);
          }
        }
      )
      .subscribe((status) => {
        logger.info('Statut de la souscription au canal:', status);
        if (status === 'SUBSCRIBED') {
          logger.info('Souscription au canal réussie');
        }
        if (status === 'CLOSED') {
          logger.warn('Canal fermé');
        }
        if (status === 'CHANNEL_ERROR') {
          logger.error('Erreur de canal');
        }
      });

    return () => {
      logger.info('Nettoyage du canal de communication');
      supabase.removeChannel(channel).then(() => {
        logger.info('Canal supprimé avec succès');
      }).catch((error) => {
        logger.error('Erreur lors de la suppression du canal:', error);
      });
    };
  }, []);

  const loadHeaderLogo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_name', 'header_logo')
        .single();
      
      if (error) {
        logger.error('Erreur lors du chargement du logo:', error);
        setError('Erreur lors du chargement du logo');
        return;
      }
      
      if (data) {
        logger.info('Logo chargé avec succès:', data.setting_value);
        setHeaderLogo(data.setting_value);
      }
    } catch (error) {
      logger.error('Erreur inattendue lors du chargement du logo:', error);
      setError('Erreur inattendue lors du chargement du logo');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-16 w-16 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    logger.error(error);
    return (
      <Link to="/" className="flex-shrink-0">
        <LazyImage 
          src="/placeholder.svg"
          alt="Lyon d'Or" 
          className="h-16 w-auto object-contain p-2" 
        />
      </Link>
    );
  }

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