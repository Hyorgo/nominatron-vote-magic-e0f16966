import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Home } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in">
      <div className="relative">
        <div className="animate-[bounce_2s_ease-in-out_infinite]">
          <Heart 
            size={64} 
            className="mb-6 text-[#D946EF] fill-[#D946EF] relative z-10"
          />
        </div>
        {/* Sparkles */}
        <div className="absolute inset-0 -m-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-[#D946EF] rounded-full
                animate-[ping_1.5s_ease-in-out_infinite]`}
              style={{
                top: `${Math.sin((i / 6) * Math.PI * 2) * 100 + 50}%`,
                left: `${Math.cos((i / 6) * Math.PI * 2) * 100 + 50}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
      </div>
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