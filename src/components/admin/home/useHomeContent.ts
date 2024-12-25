import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HomeContent, HomeContentFormData } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useHomeContent = (onUpdate: () => void) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HomeContent>>({});
  const { toast } = useToast();

  const handleAdd = async () => {
    // Calculate the highest current display_order
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
        display_order: editForm.display_order,
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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(result.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display_order for all affected items
    const updates = items.map((item, index) => ({
      id: item.id,
      section_name: item.section_name,
      display_order: index,
      is_active: item.is_active
    }));

    const { error } = await supabase
      .from('home_content')
      .upsert(updates);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'ordre des sections",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Ordre des sections mis à jour"
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
    handleDelete,
    handleDragEnd
  };
};