import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AdminTabs } from "./admin/navigation/AdminTabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryConfig } from "@/hooks/useQueryConfig";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type ScrollingText = Database['public']['Tables']['scrolling_text']['Row'];
type PageBackground = Database['public']['Tables']['page_backgrounds']['Row'];
type HomeContent = Database['public']['Tables']['home_content']['Row'];
type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

interface Settings {
  headerLogo: string;
  homeLogo: string;
  homeYearText: string;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryConfig = useQueryConfig("adminDashboard");

  const { data: scrollingTexts, isLoading: loadingTexts } = useQuery<ScrollingText[]>({
    queryKey: ["scrollingTexts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scrolling_text")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    ...queryConfig,
  });

  const { data: backgrounds, isLoading: loadingBackgrounds } = useQuery<PageBackground[]>({
    queryKey: ["backgrounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_backgrounds")
        .select("*")
        .eq("page_name", "home")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    ...queryConfig,
  });

  const { data: homeContent, isLoading: loadingContent } = useQuery<HomeContent[]>({
    queryKey: ["homeContent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    ...queryConfig,
  });

  const { data: settings, isLoading: loadingSettings } = useQuery<Settings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      if (error) throw error;
      
      const headerLogo = data?.find(s => s.setting_name === "header_logo")?.setting_value || "";
      const homeLogo = data?.find(s => s.setting_name === "home_logo")?.setting_value || "";
      const homeYearText = data?.find(s => s.setting_name === "home_year_text")?.setting_value || "";
      
      return { headerLogo, homeLogo, homeYearText };
    },
    ...queryConfig,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const isLoading = loadingTexts || loadingBackgrounds || loadingContent || loadingSettings;

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
        homeContent={homeContent || []}
        scrollingTexts={scrollingTexts || []}
        backgrounds={backgrounds || []}
        headerLogo={settings?.headerLogo || ""}
        homeLogo={settings?.homeLogo || ""}
        homeYearText={settings?.homeYearText || ""}
        onUpdate={() => {
          queryClient.invalidateQueries({ queryKey: ["scrollingTexts"] });
          queryClient.invalidateQueries({ queryKey: ["backgrounds"] });
          queryClient.invalidateQueries({ queryKey: ["homeContent"] });
          queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
        }}
      />
    </div>
  );
};