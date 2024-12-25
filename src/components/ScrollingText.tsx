import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ScrollingText = () => {
  const [texts, setTexts] = useState<string[]>([]);

  useEffect(() => {
    loadScrollingTexts();
  }, []);

  const loadScrollingTexts = async () => {
    const { data } = await supabase
      .from('scrolling_text')
      .select('content')
      .eq('is_active', true);
    
    if (data) {
      setTexts(data.map(item => item.content));
    }
  };

  if (texts.length === 0) return null;

  const content = texts.join(' • ');

  return (
    <div className="fixed bottom-16 left-0 right-0 backdrop-blur-md bg-white/5 border-t border-b border-white/10">
      <div className="relative flex overflow-hidden py-4">
        <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap flex">
          <span className="mx-8 text-primary/90">{content}</span>
          <span className="mx-8 text-primary/90">{content}</span>
        </div>
        <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap flex absolute left-[100%]">
          <span className="mx-8 text-primary/90">{content}</span>
          <span className="mx-8 text-primary/90">{content}</span>
        </div>
      </div>
    </div>
  );
};