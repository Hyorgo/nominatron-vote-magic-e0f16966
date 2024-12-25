import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HomeContentCard } from "./HomeContentCard";
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
        
        <Accordion type="single" collapsible className="space-y-4">
          {homeContent.map((content, index) => (
            <AccordionItem key={content.id} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <span className="text-lg font-medium">{content.section_name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <HomeContentCard
                  content={content}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};