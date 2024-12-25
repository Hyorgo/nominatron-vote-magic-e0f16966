import { HomeContent } from "@/types/home";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface HomeContentEditFormProps {
  editForm: Partial<HomeContent>;
  setEditForm: (form: Partial<HomeContent>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const HomeContentEditForm = ({
  editForm,
  setEditForm,
  onSave,
  onCancel
}: HomeContentEditFormProps) => {
  return (
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
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={onSave}>Sauvegarder</Button>
      </div>
    </div>
  );
};