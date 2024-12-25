import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };

  return (
    <div className="container max-w-2xl py-12 animate-fade-in relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 golden-reflection">Contact</h1>
        <p className="text-gold/80">Une question ? N'hésitez pas à nous contacter</p>
      </div>

      <div className="relative">
        {/* Effet de halo derrière le formulaire */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-xl" />
        
        {/* Formulaire avec effet glassmorphism */}
        <div className="relative bg-white/5 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gold/90">Nom</Label>
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
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gold/90">Message</Label>
              <Textarea
                id="message"
                placeholder="Votre message"
                className="min-h-[150px] bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light transition-all duration-300 text-navy font-semibold py-6"
            >
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;