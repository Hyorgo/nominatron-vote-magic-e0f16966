import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/monitoring/logger';

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const recordAuthAttempt = async (email: string, success: boolean) => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      const userAgent = navigator.userAgent;

      await supabase
        .from('auth_attempts')
        .insert([{
          email,
          ip_address: ip,
          success,
          user_agent: userAgent
        }]);
      
      logger.info('Tentative de connexion enregistrée', { email, success });
    } catch (error) {
      logger.error('Erreur lors de l\'enregistrement de la tentative', error);
    }
  };

  const verifyAdminRights = async (email: string): Promise<boolean> => {
    try {
      logger.info('Vérification des droits admin', { email });
      
      const { data, error } = await supabase
        .from('admin_users')
        .select()
        .eq('email', email)
        .maybeSingle();

      if (error) {
        logger.error('Erreur lors de la vérification admin', error);
        return false;
      }

      if (!data) {
        logger.warn('Utilisateur non trouvé dans admin_users', { email });
        return false;
      }

      logger.info('Droits admin vérifiés avec succès', { email });
      return true;
    } catch (error) {
      logger.error('Exception lors de la vérification admin', error);
      return false;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (loading) {
      logger.info('Tentative de connexion déjà en cours');
      return;
    }
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erreur de saisie",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setLoading(true);
    logger.info('Début de la tentative de connexion', { email });

    try {
      // Vérification préalable des droits admin
      const isAdmin = await verifyAdminRights(email);
      if (!isAdmin) {
        throw new Error('Accès non autorisé - Utilisateur non admin');
      }

      // Authentification
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!data.session) {
        throw new Error('Session invalide');
      }

      // Succès
      await recordAuthAttempt(email, true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration",
      });
      navigate('/admin/dashboard');
      
    } catch (error) {
      await recordAuthAttempt(email, false);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la connexion",
      });
      logger.error('Erreur lors de la connexion', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin
  };
};