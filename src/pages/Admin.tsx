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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error('Erreur lors de la récupération de la session');
        }
        
        if (session?.user?.email) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          if (adminError) {
            throw new Error('Erreur lors de la vérification des droits admin');
          }

          if (adminData) {
            logger.info('Session admin valide, redirection');
            navigate('/admin/dashboard');
          } else {
            logger.info('Session existante mais pas de droits admin');
            await supabase.auth.signOut();
          }
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