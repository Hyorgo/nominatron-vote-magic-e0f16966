import { Heart, Home, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTicketDownload } from "@/hooks/useTicketDownload";
import { useEffect } from "react";

interface SuccessContentProps {
  bookingInfo: any;
  onNavigateHome: () => void;
}

export const SuccessContent = ({ bookingInfo, onNavigateHome }: SuccessContentProps) => {
  const { isDownloading, downloadTicket } = useTicketDownload();

  useEffect(() => {
    if (bookingInfo) {
      downloadTicket(bookingInfo);
    }
  }, [bookingInfo]);

  return (
    <>
      <div className="animate-[bounce_2s_ease-in-out_infinite]">
        <Heart size={64} className="mb-6 text-[#D946EF] fill-[#D946EF]" />
      </div>
      <h1 className="mb-6 text-4xl font-bold golden-reflection">
        Paiement confirmé !
      </h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Votre réservation a été enregistrée avec succès.
      </p>
      <div className="mb-12 max-w-2xl">
        <div className="mb-6 p-6 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20">
          <p className="text-lg">
            <span className="block mb-2 text-primary text-2xl">🎉 Merci pour votre confiance ! 🎉</span>
            <span className="golden-reflection block mb-2">
              Le téléchargement de votre billet devrait démarrer automatiquement
            </span>
            <span className="text-muted-foreground">
              Si ce n'est pas le cas, vous pouvez le télécharger en cliquant sur le bouton ci-dessous.
            </span>
          </p>
        </div>
        <Button
          onClick={() => downloadTicket(bookingInfo)}
          className="w-full mb-6"
          disabled={isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Téléchargement..." : "Télécharger mon billet"}
        </Button>
      </div>
      <Button 
        onClick={onNavigateHome}
        variant="default"
        size="lg"
      >
        <Home className="mr-2" />
        Retour à l'accueil
      </Button>
    </>
  );
};