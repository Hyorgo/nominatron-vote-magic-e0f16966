import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { logger } from '@/services/monitoring/logger';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        logger.info('Vérification de la session admin');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.email) {
          logger.info('Pas de session active');
          return;
        }

        // Vérification directe avec la table admin_users
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email)
          .single();

        if (adminError) {
          logger.error('Erreur lors de la vérification des droits admin', adminError);
          if (adminError.code === 'PGRST116') {
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous n'avez pas les droits administrateur nécessaires",
            });
            return;
          }
          throw adminError;
        }

        if (adminUser) {
          logger.info('Session admin valide, redirection vers le dashboard', { email: session.user.email });
          navigate('/admin/dashboard');
        }
      } catch (error) {
        logger.error('Erreur lors de la vérification de session', error);
        toast({
          variant: "destructive",
          title: "Erreur de session",
          description: "Impossible de vérifier votre session",
        });
      }
    };

    checkAdminSession();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
};

export default Admin;