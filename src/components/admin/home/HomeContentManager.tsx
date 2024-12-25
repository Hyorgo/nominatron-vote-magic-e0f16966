import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LayoutDashboard } from "lucide-react";
import { DraggableHomeContent } from "./DraggableHomeContent";
import { EditHomeContentDialog } from "./EditHomeContentDialog";
import { useHomeContent } from "./useHomeContent";
import { HomeContent } from "./types";

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
          <EditHomeContentDialog
            editForm={editForm}
            setEditForm={setEditForm}
            onSave={handleSave}
            onClose={() => setEditForm({})}
          />
        )}
      </CardContent>
    </Card>
  );
};