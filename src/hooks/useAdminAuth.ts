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

  const verifyAdminRights = async (email: string) => {
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (adminError) {
      throw new Error('Erreur lors de la vérification admin');
    }

    if (!adminData) {
      throw new Error('Utilisateur non admin');
    }

    return true;
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
      // Vérification préalable des droits admin
      const isAdmin = await verifyAdminRights(email);
      if (!isAdmin) {
        throw new Error('Utilisateur non admin');
      }

      // Authentification
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error('Erreur d\'authentification');
      }

      if (!session) {
        throw new Error('Impossible de créer une session');
      }

      // Succès
      logger.info('Connexion admin réussie');
      await recordAuthAttempt(email, true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration",
      });
      navigate('/admin/dashboard');
    } catch (error) {
      logger.error('Erreur lors de la connexion', error);
      await recordAuthAttempt(email, false);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion",
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