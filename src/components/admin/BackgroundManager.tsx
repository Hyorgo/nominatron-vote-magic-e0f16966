import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Background {
  id: string;
  background_type: string;
  background_value: string;
  is_active: boolean;
}

interface BackgroundManagerProps {
  backgrounds: Background[];
  onUpdate: () => void;
}

export const BackgroundManager = ({
  backgrounds,
  onUpdate
}: BackgroundManagerProps) => {
  const [newBackground, setNewBackground] = useState({
    page_name: "home",
    background_type: "color",
    background_value: "#ffffff",
    is_active: true
  });
  const { toast } = useToast();

  const handleAddBackground = async () => {
    const { error } = await supabase
      .from('page_backgrounds')
      .insert([newBackground]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'arrière-plan",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Arrière-plan ajouté avec succès"
    });
    
    setNewBackground({
      page_name: "home",
      background_type: "color",
      background_value: "#ffffff",
      is_active: true
    });
    onUpdate();
  };

  const handleToggleBackground = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('page_backgrounds')
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arrière-plan</CardTitle>
        <CardDescription>
          Gérez l'arrière-plan de la page d'accueil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Type d'arrière-plan</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newBackground.background_type}
              onChange={(e) => setNewBackground({...newBackground, background_type: e.target.value})}
            >
              <option value="color">Couleur</option>
              <option value="image">Image</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Valeur</Label>
            {newBackground.background_type === 'color' ? (
              <Input
                type="color"
                value={newBackground.background_value}
                onChange={(e) => setNewBackground({...newBackground, background_value: e.target.value})}
              />
            ) : (
              <Input
                type="text"
                placeholder="URL de l'image"
                value={newBackground.background_value}
                onChange={(e) => setNewBackground({...newBackground, background_value: e.target.value})}
              />
            )}
          </div>
          <Button onClick={handleAddBackground}>Ajouter l'arrière-plan</Button>
        </div>
        <div className="space-y-2">
          {backgrounds.map((bg) => (
            <div key={bg.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {bg.background_type === 'color' ? (
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: bg.background_value }}
                  />
                ) : (
                  <img 
                    src={bg.background_value} 
                    alt="Background preview" 
                    className="w-6 h-6 object-cover rounded"
                  />
                )}
                <span>{bg.background_type}</span>
              </div>
              <Switch
                checked={bg.is_active}
                onCheckedChange={() => handleToggleBackground(bg.id, bg.is_active)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};