import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HomeContent } from "./types";

interface EditHomeContentDialogProps {
  editForm: Partial<HomeContent>;
  setEditForm: (form: Partial<HomeContent>) => void;
  onSave: () => void;
  onClose: () => void;
}

export const EditHomeContentDialog = ({
  editForm,
  setEditForm,
  onSave,
  onClose
}: EditHomeContentDialogProps) => {
  return (
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
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={onSave}>Sauvegarder</Button>
          </div>
        </div>
      </div>
    </div>
  );
};