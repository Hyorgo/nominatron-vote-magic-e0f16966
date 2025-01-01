import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { logger } from '@/services/monitoring/logger';

type ScrollingText = Database['public']['Tables']['scrolling_text']['Row'];
type PageBackground = Database['public']['Tables']['page_backgrounds']['Row'];
type HomeContent = Database['public']['Tables']['home_content']['Row'];

export const useAdminData = () => {
  const queryClient = useQueryClient();

  const { data: scrollingTexts, isLoading: loadingTexts, error: textsError } = useQuery({
    queryKey: ["scrollingTexts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("scrolling_text")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        logger.error('Erreur lors du chargement des textes défilants:', error);
        throw error;
      }
    },
  });

  const { data: backgrounds, isLoading: loadingBackgrounds, error: backgroundsError } = useQuery({
    queryKey: ["backgrounds"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("page_backgrounds")
          .select("*")
          .eq("page_name", "home")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        logger.error('Erreur lors du chargement des arrière-plans:', error);
        throw error;
      }
    },
  });

  const { data: homeContent, isLoading: loadingContent, error: contentError } = useQuery({
    queryKey: ["homeContent"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("home_content")
          .select("*")
          .order("display_order", { ascending: true });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        logger.error('Erreur lors du chargement du contenu:', error);
        throw error;
      }
    },
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["scrollingTexts"] });
    queryClient.invalidateQueries({ queryKey: ["backgrounds"] });
    queryClient.invalidateQueries({ queryKey: ["homeContent"] });
  };

  const isLoading = loadingTexts || loadingBackgrounds || loadingContent;
  const error = textsError || backgroundsError || contentError;

  return {
    scrollingTexts: scrollingTexts || [],
    backgrounds: backgrounds || [],
    homeContent: homeContent || [],
    isLoading,
    error,
    invalidateQueries
  };
};