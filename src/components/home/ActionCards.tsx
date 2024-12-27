import { Calendar, Mail } from "lucide-react";
import { ActionCard } from "./ActionCard";
import { VotingCard } from "./VotingCard";
import { useVotingStatus } from "@/hooks/useVotingStatus";
import { useHomeContent } from "@/hooks/useHomeContent";

export const ActionCards = () => {
  const votingStatus = useVotingStatus();
  const content = useHomeContent();

  const cards = [
    {
      icon: Calendar,
      title: "Réserver mes places",
      subtitle: content.card_book?.subtitle || "",
      buttonText: content.card_book?.content || "",
      to: "/reserver",
      showButton: true,
      showStar: true
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
    <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3 animate-fade-in px-4 md:px-0">
      <VotingCard votingStatus={votingStatus} />
      {cards.map((card, index) => (
        <ActionCard key={index} {...card} />
      ))}
    </div>
  );
};