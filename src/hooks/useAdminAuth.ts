import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/monitoring/logger';

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const verifyAdminRights = async (email: string): Promise<boolean> => {
    try {
      logger.info('Début de la vérification des droits admin', { email });
      
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.warn('Utilisateur non trouvé dans admin_users', { email });
          return false;
        }
        throw error;
      }

      logger.info('Droits admin vérifiés avec succès', { email, adminUser });
      return true;
    } catch (error) {
      logger.error('Exception lors de la vérification admin', { error, email });
      throw error;
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
        logger.warn('Tentative de connexion - Utilisateur non admin', { email });
        throw new Error('Accès non autorisé - Utilisateur non admin');
      }

      // Authentification
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        logger.error('Erreur d\'authentification Supabase', { error: authError, email });
        throw authError;
      }

      if (!data.session) {
        logger.error('Session invalide après authentification', { email });
        throw new Error('Session invalide');
      }

      // Succès
      logger.info('Connexion réussie', { email });
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration",
      });
      navigate('/admin/dashboard');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la connexion",
      });
      logger.error('Erreur lors de la connexion', { error, email });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin
  };
};