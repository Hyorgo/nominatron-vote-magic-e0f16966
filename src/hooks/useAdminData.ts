import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export const useAdminData = () => {
  const queryClient = useQueryClient();

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
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["scrollingTexts"] });
    queryClient.invalidateQueries({ queryKey: ["backgrounds"] });
    queryClient.invalidateQueries({ queryKey: ["homeContent"] });
    queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
  };

  const isLoading = loadingTexts || loadingBackgrounds || loadingContent || loadingSettings;

  return {
    scrollingTexts: scrollingTexts || [],
    backgrounds: backgrounds || [],
    homeContent: homeContent || [],
    settings,
    isLoading,
    invalidateQueries
  };
};