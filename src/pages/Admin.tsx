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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminData) {
          logger.info('Utilisateur admin déjà connecté, redirection');
          navigate('/admin/dashboard');
        }
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