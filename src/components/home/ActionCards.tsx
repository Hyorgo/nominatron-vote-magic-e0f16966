import { Trophy, Calendar, Mail } from "lucide-react";
import { ActionCard } from "./ActionCard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HomeContent } from "@/types/home";

export const ActionCards = () => {
  const [content, setContent] = useState<Record<string, HomeContent>>({});
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [votingNotStarted, setVotingNotStarted] = useState(false);

  useEffect(() => {
    loadContent();
    checkVotingPeriod();
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

  const checkVotingPeriod = async () => {
    try {
      const { data: configs } = await supabase
        .from('voting_config')
        .select('start_date, end_date')
        .order('created_at', { ascending: false })
        .limit(1);

      if (configs && configs.length > 0) {
        const config = configs[0];
        const now = new Date();
        const startDate = new Date(config.start_date);
        const endDate = new Date(config.end_date);
        
        setIsVotingOpen(now >= startDate && now <= endDate);
        setVotingNotStarted(now < startDate);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  const cards = [
    {
      icon: Trophy,
      title: content.card_vote?.title || "",
      subtitle: isVotingOpen 
        ? "Découvrez les nominés et votez pour vos favoris dans chaque catégorie"
        : votingNotStarted 
          ? "Les votes ne sont pas encore ouverts. Inscrivez-vous pour être notifié de l'ouverture des votes."
          : "La période de vote est terminée. Merci de votre participation !",
      buttonText: content.card_vote?.content || "",
      to: "/categories",
      showButton: isVotingOpen,
      votingNotStarted: votingNotStarted
    },
    {
      icon: Calendar,
      title: content.card_book?.title || "",
      subtitle: content.card_book?.subtitle || "",
      buttonText: content.card_book?.content || "",
      to: "/reserver",
      showButton: true
    },
    {
      icon: Mail,
      title: content.card_contact?.title || "",
      subtitle: content.card_contact?.subtitle || "",
      buttonText: content.card_contact?.content || "",
      to: "/contact",
      showButton: true
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