import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/monitoring/logger';

export const useAdminSession = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    try {
      logger.info('Vérification de la session admin');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        logger.warn('Session invalide - Pas de session');
        return false;
      }

      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', session.user.email)
        .single();

      if (error || !adminUser) {
        logger.warn('Session invalide - Utilisateur non admin', { error });
        return false;
      }

      logger.info('Session admin valide');
      return true;
    } catch (error) {
      logger.error('Erreur lors de la vérification de session', { error });
      return false;
    }
  }, []);

  const handleLogout = async () => {
    try {
      logger.info('Tentative de déconnexion');
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/admin');
    } catch (error) {
      logger.error('Erreur lors de la déconnexion:', error);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  return { checkSession, handleLogout };
};