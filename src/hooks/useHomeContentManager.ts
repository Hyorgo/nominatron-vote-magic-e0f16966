import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { HomeContent } from "@/types/home";

export const useHomeContentManager = (onUpdate: () => void) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HomeContent>>({});
  const { toast } = useToast();

  const handleAdd = async () => {
    // Récupérer le plus grand display_order existant
    const { data: existingContent } = await supabase
      .from('home_content')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const maxOrder = existingContent && existingContent.length > 0 
      ? existingContent[0].display_order 
      : -1;

    const { error } = await supabase
      .from('home_content')
      .insert({
        section_name: 'Nouvelle section',
        title: 'Nouveau titre',
        subtitle: 'Nouveau sous-titre',
        content: 'Nouveau contenu',
        display_order: maxOrder + 1,
        is_active: true
      });

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

  const handleEdit = (content: HomeContent) => {
    setIsEditing(content.id);
    setEditForm(content);
  };

  const handleSave = async () => {
    if (!isEditing || !editForm.section_name) return;

    const { error } = await supabase
      .from('home_content')
      .update({
        section_name: editForm.section_name,
        title: editForm.title,
        subtitle: editForm.subtitle,
        content: editForm.content,
        is_active: editForm.is_active
      })
      .eq('id', isEditing);

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

    setIsEditing(null);
    setEditForm({});
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

  return {
    isEditing,
    editForm,
    setEditForm,
    handleAdd,
    handleEdit,
    handleSave,
    handleToggle,
    handleDelete
  };
};