import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AdminTabs } from "./admin/navigation/AdminTabs";
import { Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { useAdminSession } from "@/hooks/useAdminSession";
import { logger } from '@/services/monitoring/logger';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession, handleLogout } = useAdminSession();
  const { 
    scrollingTexts, 
    backgrounds, 
    homeContent, 
    settings, 
    isLoading,
    invalidateQueries 
  } = useAdminData();

  useEffect(() => {
    const verifySession = async () => {
      try {
        logger.info('Début de la vérification de session admin');
        const isValid = await checkSession();
        
        if (!isValid) {
          logger.info('Session admin invalide, redirection vers la page de connexion');
          toast({
            variant: "destructive",
            title: "Session invalide",
            description: "Veuillez vous reconnecter",
          });
          navigate('/admin');
          return;
        }
        
        logger.info('Session admin valide');
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
    return (
      <div className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        headerLogo={settings?.headerLogo || ""}
        homeLogo={settings?.homeLogo || ""}
        homeYearText={settings?.homeYearText || ""}
        onUpdate={invalidateQueries}
      />
    </div>
  );
};