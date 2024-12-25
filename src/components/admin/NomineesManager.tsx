import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nominees: Nominee[];
}

interface Nominee {
  id: string;
  name: string;
  description: string;
  category_id: string;
  image_url: string | null;
}

export const NomineesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newNominee, setNewNominee] = useState({
    name: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResponse, nomineesResponse] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("nominees").select("*"),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (nomineesResponse.error) throw nomineesResponse.error;

      // Organiser les nominés par catégorie
      const categoriesWithNominees = categoriesResponse.data.map((category) => ({
        ...category,
        nominees: nomineesResponse.data.filter(
          (nominee) => nominee.category_id === category.id
        ),
      }));

      setCategories(categoriesWithNominees);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNominee = async () => {
    if (!newNominee.name.trim() || !newNominee.description.trim() || !selectedCategory) return;

    try {
      const { error } = await supabase.from("nominees").insert([
        {
          name: newNominee.name,
          description: newNominee.description,
          category_id: selectedCategory,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé ajouté avec succès",
      });

      setNewNominee({ name: "", description: "" });
      setSelectedCategory("");
      onUpdate();
      await fetchData();
    } catch (error) {
      console.error("Erreur lors de l'ajout du nominé:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le nominé",
      });
    }
  };

  const deleteNominee = async (id: string) => {
    try {
      const { error } = await supabase.from("nominees").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé supprimé avec succès",
      });

      onUpdate();
      await fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression du nominé:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le nominé",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Gestion des nominés</h3>
      
      <div className="grid gap-4 mb-4">
        <Input
          placeholder="Nom du nominé"
          value={newNominee.name}
          onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
        />
        
        <Textarea
          placeholder="Description du nominé"
          value={newNominee.description}
          onChange={(e) => setNewNominee({ ...newNominee, description: e.target.value })}
        />
        
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={addNominee}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter le nominé
        </Button>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-lg font-medium">
              {category.name} ({category.nominees.length} nominés)
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-2">
                {category.nominees.map((nominee) => (
                  <div
                    key={nominee.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{nominee.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {nominee.description}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteNominee(nominee.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {category.nominees.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Aucun nominé dans cette catégorie
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};