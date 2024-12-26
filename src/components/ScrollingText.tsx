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
      className={`w-full bg-navy/80 backdrop-blur-sm border-t border-gold/20 py-2 sm:py-3 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex overflow-hidden whitespace-nowrap">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-6 sm:gap-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {scrollingTexts.map((text) => (
                <span key={`${text.id}-${i}`} className="mx-6 sm:mx-12 text-gold/90 text-sm sm:text-base whitespace-nowrap">
                  {text.content}
                  <span className="mx-3 sm:mx-4 text-gold/30">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};