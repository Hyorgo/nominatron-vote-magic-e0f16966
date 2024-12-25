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
      <VotingCard votingStatus={votingStatus} />
      {cards.map((card, index) => (
        <ActionCard key={index} {...card} />
      ))}
    </div>
  );
};