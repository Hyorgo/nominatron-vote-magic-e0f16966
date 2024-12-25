import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HomeContent } from "@/types/home";

export const useHomeContent = () => {
  const [content, setContent] = useState<Record<string, HomeContent>>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('home_content')
      .select('*')
      .eq('is_active', true);

    if (data) {
      const contentMap = data.reduce((acc, item) => {
        acc[item.section_name] = item;
        return acc;
      }, {} as Record<string, HomeContent>);
      setContent(contentMap);
    }
  };

  return content;
};