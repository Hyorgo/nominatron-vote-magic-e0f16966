import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AdminTabs } from "./admin/navigation/AdminTabs";
import { Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    scrollingTexts, 
    backgrounds, 
    homeContent, 
    settings, 
    isLoading,
    invalidateQueries 
  } = useAdminData();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
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