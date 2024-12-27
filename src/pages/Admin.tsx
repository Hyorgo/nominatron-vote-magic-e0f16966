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

        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (adminError) {
          throw new Error('Erreur lors de la vérification des droits admin');
        }

        if (adminData) {
          logger.info('Session admin valide, redirection');
          navigate('/admin/dashboard');
        } else {
          logger.warn('Session existante mais pas de droits admin');
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les droits administrateur nécessaires",
          });
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