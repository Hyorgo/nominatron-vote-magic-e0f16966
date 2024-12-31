import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/monitoring/logger";

export const useHeaderLogo = () => {
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      if (data?.setting_value) {
        // Validate the URL
        try {
          new URL(data.setting_value);
          logger.info('Logo chargé avec succès:', data.setting_value);
          setHeaderLogo(data.setting_value);
        } catch (urlError) {
          logger.error('URL du logo invalide:', data.setting_value);
          setError('URL du logo invalide');
        }
      } else {
        setHeaderLogo(null);
      }
    } catch (error) {
      logger.error('Erreur inattendue lors du chargement du logo:', error);
      setError('Erreur inattendue lors du chargement du logo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHeaderLogo();
    
    const channelId = `site_settings_${Math.random().toString(36).substring(7)}`;
    logger.info('Création du canal avec ID:', channelId);
    
    const channel = supabase
      .channel(channelId)
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
      channel.unsubscribe().then(() => {
        logger.info('Désinscription du canal réussie');
        supabase.removeChannel(channel).then(() => {
          logger.info('Canal supprimé avec succès');
        }).catch((error) => {
          logger.error('Erreur lors de la suppression du canal:', error);
        });
      }).catch((error) => {
        logger.error('Erreur lors de la désinscription du canal:', error);
      });
    };
  }, []);

  return { headerLogo, isLoading, error };
};