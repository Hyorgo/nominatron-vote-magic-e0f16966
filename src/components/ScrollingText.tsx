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
      className={`w-full bg-navy/80 backdrop-blur-sm border-t border-gold/20 py-2 sm:py-4 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex overflow-hidden whitespace-nowrap">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-12 sm:gap-24">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {scrollingTexts.map((text) => (
                <span key={`${text.id}-${i}`} className="mx-12 sm:mx-24 text-gold/90 text-sm sm:text-lg whitespace-nowrap">
                  {text.content}
                  <span className="mx-4 sm:mx-8 text-gold/30">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};