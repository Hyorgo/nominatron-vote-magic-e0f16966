import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AdminTabs } from "./admin/navigation/AdminTabs";
import { Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    scrollingTexts, 
    backgrounds, 
    homeContent, 
    settings, 
    isLoading,
    invalidateQueries 
  } = useAdminData();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      // Redirection vers la page d'accueil après la déconnexion
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

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