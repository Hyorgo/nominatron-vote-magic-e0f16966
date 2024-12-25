import { Trophy, Calendar, Mail } from "lucide-react";
import { ActionCard } from "./ActionCard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HomeContent } from "@/types/home";

export const ActionCards = () => {
  const [content, setContent] = useState<Record<string, HomeContent>>({});
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [votingNotStarted, setVotingNotStarted] = useState(false);
  const [votingEnded, setVotingEnded] = useState(false);

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
        
        // Convertir les dates en timestamps pour une comparaison plus précise
        const nowTs = now.getTime();
        const startTs = startDate.getTime();
        const endTs = endDate.getTime();
        
        console.log("État des votes (ActionCards):", {
          maintenant: now.toLocaleString(),
          debut: startDate.toLocaleString(),
          fin: endDate.toLocaleString(),
          votesOuverts: nowTs >= startTs && nowTs <= endTs,
          votesNonCommences: nowTs < startTs,
          votesTermines: nowTs > endTs,
          timestamps: {
            now: nowTs,
            start: startTs,
            end: endTs
          }
        });
        
        setIsVotingOpen(nowTs >= startTs && nowTs <= endTs);
        setVotingNotStarted(nowTs < startTs);
        setVotingEnded(nowTs > endTs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  const getVotingCardContent = () => {
    if (votingEnded) {
      return {
        title: "Les votes sont terminés",
        subtitle: "Merci à tous les participants ! Les résultats seront bientôt annoncés.",
        showButton: false,
        votingNotStarted: false
      };
    }
    
    if (votingNotStarted) {
      return {
        title: "Les votes ne sont pas encore ouverts",
        subtitle: "Inscrivez-vous pour être notifié dès l'ouverture des votes et ne manquez pas l'occasion de soutenir vos favoris !",
        showButton: false,
        votingNotStarted: true
      };
    }
    
    return {
      title: "Les votes sont ouverts !",
      subtitle: "C'est le moment de soutenir vos favoris ! Votez maintenant et faites entendre votre voix.",
      showButton: true,
      votingNotStarted: false
    };
  };

  const votingCard = {
    icon: Trophy,
    ...getVotingCardContent(),
    buttonText: "Voter maintenant",
    to: "/categories"
  };

  const cards = [
    votingCard,
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