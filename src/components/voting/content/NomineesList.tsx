import { Category } from "@/types/nominees";
import { NomineeCard } from "../NomineeCard";
import { useToast } from "@/hooks/use-toast";

interface NomineesListProps {
  category: Category;
  selectedNominees: Record<string, string>;
  onVote: (nomineeId: string) => Promise<void>;
}

export const NomineesList = ({ category, selectedNominees, onVote }: NomineesListProps) => {
  const { toast } = useToast();

  const handleVote = async (nomineeId: string) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Vous devez être connecté avec un email validé pour voter.",
        });
        return;
      }

      await onVote(nomineeId);
      
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été enregistré avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors du vote:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors du vote",
        description: "Une erreur est survenue lors de l'enregistrement de votre vote. Veuillez réessayer."
      });
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {category.nominees.map((nominee) => {
        const isSelected = selectedNominees[category.id] === nominee.id;
        console.log(`Nominee ${nominee.id} selected:`, isSelected);
        
        return (
          <NomineeCard
            key={nominee.id}
            nominee={nominee}
            isSelected={isSelected}
            onClick={() => handleVote(nominee.id)}
          />
        );
      })}
    </div>
  );
};