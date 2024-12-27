import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { logger } from '@/services/monitoring/logger';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      logger.info('Vérification de la session admin');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        logger.error('Erreur lors de la récupération de la session', sessionError);
        return;
      }
      
      if (session?.user?.email) {
        logger.info('Session trouvée, vérification des droits admin');
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminError) {
          logger.error('Erreur lors de la vérification des droits admin', adminError);
          return;
        }

        if (adminData) {
          logger.info('Utilisateur admin déjà connecté, redirection');
          navigate('/admin/dashboard');
        } else {
          logger.info('Session existante mais pas de droits admin');
          await supabase.auth.signOut();
        }
      } else {
        logger.info('Aucune session active');
      }
    } catch (error) {
      logger.error('Erreur lors de la vérification admin', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
};

export default Admin;