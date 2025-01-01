import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AdminTabs } from "./admin/navigation/AdminTabs";
import { LoadingState } from "./admin/states/LoadingState";
import { ErrorState } from "./admin/states/ErrorState";
import { useToast } from "@/hooks/use-toast";
import { useAdminSession } from "@/hooks/useAdminSession";
import { useAdminData } from "@/hooks/useAdminData";
import { logger } from '@/services/monitoring/logger';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession, handleLogout } = useAdminSession();
  const { 
    scrollingTexts, 
    backgrounds, 
    homeContent, 
    isLoading,
    error,
    invalidateQueries 
  } = useAdminData();

  useEffect(() => {
    const verifySession = async () => {
      try {
        logger.info('Vérification de la session admin');
        const isValid = await checkSession();
        
        if (!isValid) {
          logger.warn('Session admin invalide, redirection vers la page de connexion');
          toast({
            variant: "destructive",
            title: "Session invalide",
            description: "Veuillez vous reconnecter",
          });
          navigate('/admin');
        } else {
          logger.info('Session admin valide');
        }
      } catch (error) {
        logger.error('Erreur lors de la vérification de session', error);
        toast({
          variant: "destructive",
          title: "Erreur de session",
          description: "Une erreur est survenue lors de la vérification de votre session",
        });
        navigate('/admin');
      }
    };

    verifySession();
  }, [checkSession, navigate, toast]);

  if (isLoading) {
    return <LoadingState message="Chargement du tableau de bord..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <ErrorState 
          title="Erreur de chargement" 
          message="Impossible de charger les données du tableau de bord" 
          onRetry={invalidateQueries}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button onClick={handleLogout} className="w-full sm:w-auto">
          Déconnexion
        </Button>
      </div>

      <AdminTabs
        homeContent={homeContent}
        scrollingTexts={scrollingTexts}
        backgrounds={backgrounds}
        onUpdate={invalidateQueries}
      />
    </div>
  );
};