import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScrollingText {
  id: string;
  content: string;
  is_active: boolean;
}

export const ScrollingTextManager = ({
  scrollingTexts,
  onUpdate
}: {
  scrollingTexts: ScrollingText[];
  onUpdate: () => void;
}) => {
  const [newScrollingText, setNewScrollingText] = useState("");
  const { toast } = useToast();

  const handleAddScrollingText = async () => {
    if (!newScrollingText.trim()) {
      toast({
        title: "Erreur",
        description: "Le texte ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('scrolling_text')
      .insert([{ content: newScrollingText }]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le texte défilant",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Texte défilant ajouté avec succès"
    });
    
    setNewScrollingText("");
    onUpdate();
  };

  const handleToggleScrollingText = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('scrolling_text')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
      return;
    }

    onUpdate();
  };

  const handleDeleteScrollingText = async (id: string) => {
    const { error } = await supabase
      .from('scrolling_text')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le texte défilant",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Texte défilant supprimé avec succès"
    });
    
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Texte défilant</CardTitle>
        <CardDescription>
          Gérez le texte défilant qui apparaît sur la page d'accueil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Nouveau texte défilant"
            value={newScrollingText}
            onChange={(e) => setNewScrollingText(e.target.value)}
          />
          <Button onClick={handleAddScrollingText}>Ajouter</Button>
        </div>
        <div className="space-y-2">
          {scrollingTexts.map((text) => (
            <div key={text.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/10 transition-colors">
              <span className="flex-grow mr-4">{text.content}</span>
              <div className="flex items-center gap-4">
                <Switch
                  checked={text.is_active}
                  onCheckedChange={() => handleToggleScrollingText(text.id, text.is_active)}
                />
                <Button
                  variant="destructive"
                  size="default"
                  onClick={() => handleDeleteScrollingText(text.id)}
                  className="flex items-center gap-2 px-4 py-2 font-medium"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Supprimer</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};