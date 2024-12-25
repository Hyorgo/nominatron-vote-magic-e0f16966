import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { EventInfoCard } from "@/components/event/EventInfoCard";

const Reserver = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Réservation envoyée",
      description: "Nous vous contacterons prochainement pour confirmer votre réservation.",
    });
  };

  return (
    <div className="container max-w-2xl py-12 animate-fade-in relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 golden-reflection">Réserver ma place</h1>
        <p className="text-gold/80">Réservez vos places pour la soirée des Trophées de l'Innovation</p>
      </div>

      <div className="mb-8">
        <EventInfoCard />
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-xl" />
        
        <div className="relative bg-white/5 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gold/90">Nom complet</Label>
                <Input 
                  id="name" 
                  placeholder="Votre nom" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gold/90">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="votre@email.com" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gold/90">Téléphone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Votre numéro" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-gold/90">Nombre de personnes</Label>
                <Input 
                  id="guests" 
                  type="number" 
                  min="1" 
                  max="10" 
                  defaultValue="1" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light transition-all duration-300 text-navy font-semibold py-6"
            >
              Réserver maintenant
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reserver;