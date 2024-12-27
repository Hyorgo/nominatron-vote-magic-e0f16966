import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ScrollingText {
  id: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const fetchScrollingTexts = async (): Promise<ScrollingText[]> => {
  const { data, error } = await supabase
    .from("scrolling_text")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

export const useScrollingText = () => {
  return useQuery<ScrollingText[], Error>({
    queryKey: ["scrollingText"],
    queryFn: fetchScrollingTexts,
  });
};