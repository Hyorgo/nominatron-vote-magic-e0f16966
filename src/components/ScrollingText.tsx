import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ScrollingText {
  id: string;
  content: string;
  is_active: boolean;
}

export const ScrollingText = () => {
  const [scrollingTexts, setScrollingTexts] = useState<ScrollingText[]>([]);
  const [isVisible, setIsVisible] = useState(false);

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
      setIsVisible(true);
    }
  };

  if (scrollingTexts.length === 0) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-navy/80 backdrop-blur-sm border-t border-gold/20 py-4 z-50 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex overflow-hidden whitespace-nowrap">
        <div className="animate-[scroll_30s_linear_infinite] flex items-center">
          {scrollingTexts.map((text, index) => (
            <span key={text.id} className="mx-16 text-gold/90 text-lg">
              {text.content}
              <span className="mx-6 text-gold/30">•</span>
            </span>
          ))}
        </div>
        <div className="animate-[scroll_30s_linear_infinite] flex items-center absolute left-[100%] top-0">
          {scrollingTexts.map((text, index) => (
            <span key={`${text.id}-duplicate`} className="mx-16 text-gold/90 text-lg">
              {text.content}
              <span className="mx-6 text-gold/30">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};