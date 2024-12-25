import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Eye, Save, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HomeContent } from "@/types/home";

interface HomeContentCardProps {
  content: HomeContent;
  onEdit: (content: HomeContent) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentState: boolean) => void;
}

export const HomeContentCard = ({
  content,
  onEdit,
  onDelete,
  onToggle,
}: HomeContentCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(content);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    onEdit(editForm);
    setIsEditing(false);
  };

  return (
    <Card className="border border-border p-4 space-y-4 transition-all duration-300 hover:border-primary/50">
      {isEditing ? (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium">Nom de la section</label>
            <Input
              value={editForm.section_name}
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
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <h3 className="text-lg font-semibold">{content.section_name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={content.is_active}
                onCheckedChange={() => onToggle(content.id, content.is_active)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(content.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {showPreview ? (
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2 animate-fade-in">
              {content.title && <h4 className="text-xl font-bold">{content.title}</h4>}
              {content.subtitle && <h5 className="text-lg text-muted-foreground">{content.subtitle}</h5>}
              {content.content && <p className="text-sm">{content.content}</p>}
            </div>
          ) : (
            <>
              {content.title && <p className="font-medium">{content.title}</p>}
              {content.subtitle && <p className="text-muted-foreground">{content.subtitle}</p>}
              {content.content && <p className="text-sm line-clamp-2">{content.content}</p>}
            </>
          )}
        </div>
      )}
    </Card>
  );
};