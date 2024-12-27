import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useScrollingText, ScrollingText as ScrollingTextType } from "@/hooks/useScrollingText";
import { useToast } from "@/hooks/use-toast";

export const ScrollingText = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: scrollingTexts = [], isLoading, error } = useScrollingText();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollingTexts && scrollingTexts.length > 0) {
      setIsVisible(true);
    }
  }, [scrollingTexts]);

  useEffect(() => {
    if (error) {
      console.error('Erreur lors du chargement des textes défilants:', error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les textes défilants. Veuillez rafraîchir la page.",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="w-full bg-navy/80 backdrop-blur-sm border-t border-gold/20 py-2 sm:py-3">
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gold/90" />
        </div>
      </div>
    );
  }

  if (!scrollingTexts || scrollingTexts.length === 0) return null;

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
              {scrollingTexts.map((text: ScrollingTextType) => (
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