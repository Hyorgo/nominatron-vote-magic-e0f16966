import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
    } catch (error) {
      console.error('Error recording auth attempt:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (loading) return;
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erreur de saisie",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        await recordAuthAttempt(email, false);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
        return;
      }

      if (session) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          await recordAuthAttempt(email, false);
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'administration",
          });
          return;
        }

        await recordAuthAttempt(email, true);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration",
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
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