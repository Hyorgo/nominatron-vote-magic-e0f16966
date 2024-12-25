import { Trophy, Calendar, Mail } from "lucide-react";
import { ActionCard } from "./ActionCard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HomeContent } from "@/types/home";

export const ActionCards = () => {
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

  const cards = [
    {
      icon: Trophy,
      title: content.card_vote?.title || "",
      subtitle: content.card_vote?.subtitle || "",
      buttonText: content.card_vote?.content || "",
      to: "/categories"
    },
    {
      icon: Calendar,
      title: content.card_book?.title || "",
      subtitle: content.card_book?.subtitle || "",
      buttonText: content.card_book?.content || "",
      to: "/reserver"
    },
    {
      icon: Mail,
      title: content.card_contact?.title || "",
      subtitle: content.card_contact?.subtitle || "",
      buttonText: content.card_contact?.content || "",
      to: "/contact"
    }
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3 animate-fade-in">
      {cards.map((card, index) => (
        <ActionCard key={index} {...card} />
      ))}
    </div>
  );
};