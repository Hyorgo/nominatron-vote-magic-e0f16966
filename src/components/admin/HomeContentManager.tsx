import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomeContent {
  id: string;
  section_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  is_active: boolean;
  display_order: number;
}

export const HomeContentManager = ({
  homeContent,
  onUpdate
}: {
  homeContent: HomeContent[];
  onUpdate: () => void;
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HomeContent>>({});
  const { toast } = useToast();

  const handleAdd = async () => {
    // First, get the highest display_order
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
        content: editForm.content
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenu de la page d'accueil</CardTitle>
        <CardDescription>
          Gérez les différentes sections de contenu de la page d'accueil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAdd} className="w-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une section
        </Button>
        
        <div className="space-y-4">
          {homeContent.map((content) => (
            <div key={content.id} className="border border-border rounded-lg p-4 space-y-4">
              {isEditing === content.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nom de la section</label>
                    <Input
                      value={editForm.section_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, section_name: e.target.value })}
                      placeholder="Nom de la section"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Titre</label>
                    <Input
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Titre"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sous-titre</label>
                    <Input
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      placeholder="Sous-titre"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contenu</label>
                    <Textarea
                      value={editForm.content || ''}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      placeholder="Contenu"
                    />
                  </div>
                  <Button onClick={handleSave}>Sauvegarder</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{content.section_name}</h3>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={content.is_active}
                        onCheckedChange={() => handleToggle(content.id, content.is_active)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(content)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(content.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {content.title && <p className="font-medium">{content.title}</p>}
                  {content.subtitle && <p className="text-muted-foreground">{content.subtitle}</p>}
                  {content.content && <p className="text-sm">{content.content}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};