import { Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

interface SuccessContentProps {
  bookingInfo: any;
  onNavigateHome: () => void;
}

export const SuccessContent = ({ bookingInfo, onNavigateHome }: SuccessContentProps) => {
  console.log('SuccessContent - bookingInfo reçu:', bookingInfo);

  const qrCodeData = bookingInfo ? JSON.stringify({
    firstName: bookingInfo.firstName,
    lastName: bookingInfo.lastName,
    email: bookingInfo.email,
    numberOfTickets: bookingInfo.numberOfTickets,
    paymentStatus: "validé"
  }) : "";

  if (!bookingInfo) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Heart size={64} className="text-[#D946EF] fill-[#D946EF] animate-[bounce_2s_ease-in-out_infinite]" />
        </div>
        <h1 className="mb-6 text-4xl font-bold golden-reflection">
          Paiement confirmé !
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Votre réservation a été enregistrée avec succès.
        </p>
        <Button 
          onClick={onNavigateHome}
          variant="default"
          size="lg"
        >
          <Home className="mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <Heart size={64} className="text-[#D946EF] fill-[#D946EF] animate-[bounce_2s_ease-in-out_infinite]" />
      </div>
      <h1 className="mb-6 text-4xl font-bold golden-reflection">
        Paiement confirmé !
      </h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Votre réservation a été enregistrée avec succès.
      </p>
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="mb-6 p-6 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20">
          <p className="text-lg">
            <span className="block mb-2 text-primary text-2xl">🎉 Merci pour votre confiance ! 🎉</span>
            <span className="text-muted-foreground">
              Voici votre QR code de réservation :
            </span>
          </p>
          
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <QRCodeSVG
                value={qrCodeData}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-6 text-left space-y-2">
              <p><strong>Nom :</strong> {bookingInfo.lastName}</p>
              <p><strong>Prénom :</strong> {bookingInfo.firstName}</p>
              <p><strong>Email :</strong> {bookingInfo.email}</p>
              <p><strong>Nombre de places :</strong> {bookingInfo.numberOfTickets}</p>
              <p><strong>Statut du paiement :</strong> Validé</p>
            </div>
          </div>
        </div>
      </div>
      <Button 
        onClick={onNavigateHome}
        variant="default"
        size="lg"
      >
        <Home className="mr-2" />
        Retour à l'accueil
      </Button>
    </div>
  );
};