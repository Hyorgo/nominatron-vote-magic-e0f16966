import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit } from "lucide-react";
import { HomeContentEditForm } from "./home/HomeContentEditForm";
import { useHomeContentManager } from "@/hooks/useHomeContentManager";
import type { HomeContent } from "@/types/home";

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
    handleDelete
  } = useHomeContentManager(onUpdate);

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
            <div key={content.id} className="border border-border rounded-lg p-4">
              {isEditing === content.id ? (
                <HomeContentEditForm
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onSave={handleSave}
                  onCancel={() => setEditForm({})}
                />
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