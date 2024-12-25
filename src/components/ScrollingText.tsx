import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ScrollingText {
  id: string;
  content: string;
  is_active: boolean;
}

export const ScrollingText = () => {
  const [scrollingTexts, setScrollingTexts] = useState<ScrollingText[]>([]);

  useEffect(() => {
    loadScrollingTexts();
  }, []);

  const loadScrollingTexts = async () => {
    const { data } = await supabase
      .from('scrolling_text')
      .select('*')
      .eq('is_active', true);
    
    if (data) {
      setScrollingTexts(data);
    }
  };

  if (scrollingTexts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy/90 backdrop-blur-md border-t border-gold/30 py-3 z-50">
      <div className="flex overflow-hidden whitespace-nowrap">
        <div className="animate-[scroll_20s_linear_infinite] flex">
          {scrollingTexts.map((text, index) => (
            <span key={text.id} className="mx-8 text-gold">
              {text.content}
            </span>
          ))}
        </div>
        <div className="animate-[scroll_20s_linear_infinite] flex">
          {scrollingTexts.map((text, index) => (
            <span key={`${text.id}-duplicate`} className="mx-8 text-gold">
              {text.content}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};