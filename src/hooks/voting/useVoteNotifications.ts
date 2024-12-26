import { useToast } from "@/hooks/use-toast";

export const useVoteNotifications = () => {
  const { toast } = useToast();

  const notifyVoteSuccess = () => {
    toast({
      title: "Vote enregistré",
      description: "Votre vote a été enregistré avec succès.",
    });
  };

  const notifyVoteError = (error: Error) => {
    console.error('Erreur détaillée lors du vote:', error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement de votre vote.",
    });
  };

  const notifyVotingClosed = () => {
    toast({
      variant: "destructive",
      title: "Votes fermés",
      description: "Les votes ne sont pas ouverts actuellement.",
    });
  };

  const notifyNotAuthenticated = () => {
    toast({
      variant: "destructive",
      title: "Non connecté",
      description: "Vous devez être connecté avec un email validé pour voter.",
    });
  };

  return {
    notifyVoteSuccess,
    notifyVoteError,
    notifyVotingClosed,
    notifyNotAuthenticated,
  };
};