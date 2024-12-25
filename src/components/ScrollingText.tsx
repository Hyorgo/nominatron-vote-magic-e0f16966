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

  return (
    <div className="fixed bottom-16 left-0 right-0 backdrop-blur-md bg-white/5 border-t border-b border-white/10">
      <div className="overflow-hidden py-4 whitespace-nowrap">
        <div className="animate-[scroll_20s_linear_infinite] inline-block">
          {texts.map((text, index) => (
            <span key={index} className="mx-16 text-primary/90">
              {text}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {texts.map((text, index) => (
            <span key={`duplicate-${index}`} className="mx-16 text-primary/90">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};