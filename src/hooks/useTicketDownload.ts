import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useTicketDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadTicket = async (bookingInfo: any) => {
    console.log('Fonction downloadTicket appelée avec bookingInfo:', bookingInfo);
    
    if (!bookingInfo || !bookingInfo.firstName || !bookingInfo.lastName || !bookingInfo.email || !bookingInfo.numberOfTickets) {
      console.error('Informations de réservation invalides:', bookingInfo);
      toast({
        title: "Erreur",
        description: "Informations de réservation manquantes ou invalides",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setIsDownloading(true);
      
      // Pour l'instant, on affiche juste un message de succès
      toast({
        title: "Succès",
        description: "Votre réservation a été enregistrée",
        duration: 5000,
      });

    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    downloadTicket
  };
};