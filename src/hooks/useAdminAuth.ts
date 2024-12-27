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
      logger.info('Enregistrement de la tentative de connexion', { email, success });
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      const userAgent = navigator.userAgent;

      const { error } = await supabase
        .from('auth_attempts')
        .insert([{
          email,
          ip_address: ip,
          success,
          user_agent: userAgent
        }]);

      if (error) {
        logger.error('Erreur lors de l\'enregistrement de la tentative', error);
      }
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'IP', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (loading) {
      logger.info('Tentative de connexion déjà en cours');
      return;
    }
    
    if (!email || !password) {
      logger.warn('Email ou mot de passe manquant');
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
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        logger.error('Erreur d\'authentification', authError);
        await recordAuthAttempt(email, false);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
        return;
      }

      if (session) {
        logger.info('Session créée, vérification des droits admin');
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminError || !adminData) {
          logger.error('Erreur de vérification admin', adminError);
          await supabase.auth.signOut();
          await recordAuthAttempt(email, false);
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'administration",
          });
          return;
        }

        logger.info('Connexion admin réussie');
        await recordAuthAttempt(email, true);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration",
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      logger.error('Erreur inattendue', error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin
  };
};