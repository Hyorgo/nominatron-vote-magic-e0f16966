import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ScrollingText = Database['public']['Tables']['scrolling_text']['Row'];
type PageBackground = Database['public']['Tables']['page_backgrounds']['Row'];
type HomeContent = Database['public']['Tables']['home_content']['Row'];

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

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["scrollingTexts"] });
    queryClient.invalidateQueries({ queryKey: ["backgrounds"] });
    queryClient.invalidateQueries({ queryKey: ["homeContent"] });
  };

  const isLoading = loadingTexts || loadingBackgrounds || loadingContent;

  return {
    scrollingTexts: scrollingTexts || [],
    backgrounds: backgrounds || [],
    homeContent: homeContent || [],
    isLoading,
    invalidateQueries
  };
};