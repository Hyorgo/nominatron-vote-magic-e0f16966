import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTicketDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadTicket = async (bookingInfo: any) => {
    if (!bookingInfo) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations de réservation",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);
      console.log('Envoi des données pour génération du PDF:', bookingInfo);
      
      const { data, error } = await supabase.functions.invoke('generate-ticket-pdf', {
        body: bookingInfo
      });

      if (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        throw error;
      }

      if (!data) {
        console.error('Pas de données reçues du serveur');
        throw new Error('Pas de données reçues du serveur');
      }

      console.log('Données PDF reçues, création du blob...');
      
      // Convertir le base64 en Uint8Array
      const pdfBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
      
      // Créer un blob à partir des données
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien temporaire pour télécharger le PDF
      const link = document.createElement('a');
      link.href = url;
      link.download = 'billet.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Votre billet a été téléchargé",
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement du billet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger votre billet. Veuillez réessayer.",
        variant: "destructive",
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