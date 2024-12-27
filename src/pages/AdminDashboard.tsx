import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboard as AdminDashboardComponent } from "@/components/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        logger.info('Vérification de la session dans AdminDashboard');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          logger.warn('Pas de session active dans AdminDashboard');
          navigate('/admin');
          return;
        }

        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email)
          .single();

        if (error || !adminUser) {
          logger.warn('Utilisateur non admin dans AdminDashboard');
          toast({
            variant: "destructive",
            title: "Accès non autorisé",
            description: "Vous n'avez pas les droits administrateur",
          });
          navigate('/admin');
          return;
        }

        logger.info('Session admin valide dans AdminDashboard');
      } catch (error) {
        logger.error('Erreur lors de la vérification de session dans AdminDashboard', error);
        navigate('/admin');
      }
    };

    checkSession();
  }, [navigate, toast]);

  return <AdminDashboardComponent />;
};

export default AdminDashboard;