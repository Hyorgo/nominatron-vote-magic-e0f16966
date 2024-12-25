import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="container max-w-2xl py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Réserver ma place</h1>
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" placeholder="Votre nom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" type="tel" placeholder="Votre numéro de téléphone" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests">Nombre de personnes</Label>
            <Input id="guests" type="number" min="1" max="10" defaultValue="1" required />
          </div>
          <Button type="submit" className="w-full">
            Réserver
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Reserver;