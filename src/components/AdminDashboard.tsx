import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AdminTabs } from "./admin/navigation/AdminTabs";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    loading,
    scrollingTexts,
    backgrounds,
    homeContent,
    headerLogo,
    homeLogo,
    homeYearText,
    loadHomePageData
  } = useAdminDashboardData();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (loading) {
    return <div className="container mx-auto p-4 md:p-6">Chargement...</div>;
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
        headerLogo={headerLogo}
        homeLogo={homeLogo}
        homeYearText={homeYearText}
        onUpdate={loadHomePageData}
      />
    </div>
  );
};