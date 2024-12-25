import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LayoutDashboard } from "lucide-react";
import { DraggableHomeContent } from "./DraggableHomeContent";
import { HomeContent } from "./types";
import { useHomeContent } from "./useHomeContent";

export const HomeContentManager = ({
  homeContent,
  onUpdate
}: {
  homeContent: HomeContent[];
  onUpdate: () => void;
}) => {
  const {
    isEditing,
    editForm,
    setEditForm,
    handleAdd,
    handleEdit,
    handleSave,
    handleToggle,
    handleDelete,
    handleDragEnd
  } = useHomeContent(onUpdate);

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

        {isEditing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Modifier la section</h2>
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditForm({})}>Annuler</Button>
                  <Button onClick={handleSave}>Sauvegarder</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};