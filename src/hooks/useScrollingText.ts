import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryConfig } from "./useQueryConfig";

export interface ScrollingText {
  id: string;
  content: string;
  is_active: boolean;
}

const fetchScrollingTexts = async (): Promise<ScrollingText[]> => {
  const { data, error } = await supabase
    .from('scrolling_text')
    .select('*')
    .eq('is_active', true);

  if (error) {
    throw error;
  }

  return data || [];
};

export const useScrollingText = () => {
  const queryConfig = useQueryConfig("scrollingTexts");

  return useQuery<ScrollingText[], Error>({
    queryKey: ["scrollingTexts"],
    queryFn: fetchScrollingTexts,
    ...queryConfig,
  });
};