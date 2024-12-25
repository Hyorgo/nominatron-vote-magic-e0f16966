import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CategoryNavigation } from "./voting/CategoryNavigation";
import { NomineeCard } from "./voting/NomineeCard";
import { useVoting } from "@/hooks/useVoting";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Nominee {
  id: number;
  name: string;
  description: string;
}

interface Category {
  id: number;
  name: string;
  nominees: Nominee[];
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Meilleur Restaurant",
    nominees: [
      { id: 1, name: "Le Gourmet", description: "Cuisine française raffinée" },
      { id: 2, name: "Sushi Master", description: "Sushi et cuisine japonaise" },
      { id: 3, name: "La Trattoria", description: "Authentique cuisine italienne" },
      { id: 4, name: "Le Bistrot", description: "Cuisine traditionnelle" },
      { id: 5, name: "L'Innovation", description: "Cuisine fusion moderne" },
    ],
  },
];

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { isVotingOpen, selectedNominees, handleNomineeSelect } = useVoting();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { toast } = useToast();

  const category = mockCategories[currentCategory];

  // Charger les votes précédents de l'utilisateur
  useEffect(() => {
    const loadPreviousVotes = async () => {
      if (formData.email) {
        try {
          const { data: previousVotes, error } = await supabase
            .from("votes")
            .select("category_id, nominee_id")
            .eq("email", formData.email);

          if (error) throw error;

          if (previousVotes) {
            // Mettre à jour selectedNominees avec les votes précédents
            const votesMap = previousVotes.reduce((acc, vote) => ({
              ...acc,
              [vote.category_id]: vote.nominee_id,
            }), {});
            
            toast({
              title: "Votes précédents chargés",
              description: "Vos votes précédents ont été restaurés.",
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement des votes:", error);
        }
      }
    };

    loadPreviousVotes();
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Vérifier si l'email existe déjà dans validated_emails
      const { data: existingEmail } = await supabase
        .from("validated_emails")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (existingEmail) {
        // Email déjà validé, fermer le dialogue
        setDialogOpen(false);
        toast({
          title: "Email déjà enregistré",
          description: "Vos votes précédents ont été restaurés.",
        });
      } else {
        // Ajouter le nouvel email validé
        const { error } = await supabase
          .from("validated_emails")
          .insert([
            {
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          ]);

        if (error) throw error;
        
        setDialogOpen(false);
        toast({
          title: "Inscription réussie",
          description: "Vous pouvez maintenant voter pour vos favoris.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation.",
      });
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-center mb-8">
        {isVotingOpen ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Découvrez les nominés et votez pour vos favoris dans chaque catégorie
            </h2>
            <Button 
              variant="default" 
              size="lg" 
              className="mb-8"
              onClick={() => setDialogOpen(true)}
            >
              Voter maintenant
            </Button>
          </>
        ) : (
          <h2 className="text-2xl font-bold mb-4">
            Les votes ne sont pas encore ouverts. Revenez bientôt pour découvrir les nominés et voter pour vos favoris.
          </h2>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscription pour voter</DialogTitle>
            <DialogDescription>
              Veuillez renseigner vos informations pour participer aux votes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Valider
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isVotingOpen && (
        <>
          <CategoryNavigation
            categoryName={category.name}
            currentIndex={currentCategory}
            totalCategories={mockCategories.length}
            onPrevious={() => setCurrentCategory((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentCategory((prev) => Math.min(mockCategories.length - 1, prev + 1))}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.nominees.map((nominee) => (
              <NomineeCard
                key={nominee.id}
                nominee={nominee}
                isSelected={selectedNominees[category.id] === nominee.id}
                onClick={() => handleNomineeSelect(category.id, nominee.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};