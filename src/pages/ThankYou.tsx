import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Home } from "lucide-react";
import { ShareButtons } from "@/components/thank-you/ShareButtons";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in relative">
      <div className="animate-[bounce_2s_ease-in-out_infinite]">
        <Heart 
          size={64} 
          className="mb-6 text-[#D946EF] fill-[#D946EF]"
          aria-hidden="true"
        />
      </div>
      
      <h1 className="mb-6 text-4xl font-bold golden-reflection">
        Merci pour votre participation !
      </h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Vos votes ont été enregistrés avec succès.
      </p>

      <div className="mb-12 max-w-2xl w-full">
        <div className="mb-6 p-6 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20">
          <p className="text-lg font-medium">
            <span className="block mb-2 text-primary text-2xl">🌟 Faites la différence ! 🌟</span>
            <span className="golden-reflection">
              Aidez vos établissements favoris à gagner
            </span>
            <br />
            <span className="text-muted-foreground">
              en partageant et en invitant vos amis à voter !
            </span>
          </p>
        </div>
        
        <ShareButtons />
      </div>

      <Button 
        onClick={() => navigate("/")}
        variant="default"
        size="lg"
        className="min-w-[200px]"
      >
        <Home className="mr-2" aria-hidden="true" />
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default ThankYou;