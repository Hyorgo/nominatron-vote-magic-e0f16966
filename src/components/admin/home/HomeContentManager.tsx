import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DraggableHomeContent } from "./DraggableHomeContent";
import { HomeContent } from "@/types/home";

export const HomeContentManager = ({
  homeContent,
  onUpdate
}: {
  homeContent: HomeContent[];
  onUpdate: () => void;
}) => {
  const { toast } = useToast();

  const handleAdd = async () => {
    const { error } = await supabase
      .from('home_content')
      .insert([{
        section_name: 'Nouvelle section',
        title: 'Nouveau titre',
        subtitle: 'Nouveau sous-titre',
        content: 'Nouveau contenu'
      }]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la section",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Section ajoutée avec succès"
    });
    
    onUpdate();
  };

  const handleEdit = async (content: HomeContent) => {
    const { error } = await supabase
      .from('home_content')
      .update({
        section_name: content.section_name,
        title: content.title,
        subtitle: content.subtitle,
        content: content.content
      })
      .eq('id', content.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Modifications sauvegardées avec succès"
    });

    onUpdate();
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('home_content')
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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('home_content')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la section",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Section supprimée avec succès"
    });
    
    onUpdate();
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(homeContent);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour l'ordre dans la base de données
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index
      }));

      const { error } = await supabase
        .from('home_content')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Ordre des sections mis à jour"
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'ordre des sections",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <CardTitle>Contenu de la page d'accueil</CardTitle>
        </div>
        <CardDescription>
          Gérez les différentes sections de contenu de la page d'accueil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAdd} className="w-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une section
        </Button>
        
        <DraggableHomeContent
          contents={homeContent}
          onDragEnd={handleDragEnd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      </CardContent>
    </Card>
  );
};