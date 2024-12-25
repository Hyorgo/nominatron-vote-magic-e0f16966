import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in">
      <h1 className="mb-6 text-4xl font-bold golden-reflection">
        Merci pour votre participation !
      </h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Vos votes ont été enregistrés avec succès.
      </p>
      <Button 
        onClick={() => navigate("/")}
        variant="outline"
        size="lg"
      >
        <Home className="mr-2" />
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default ThankYou;