import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Pencil, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface CategoryListProps {
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

export const CategoryList = ({ categories, onDelete, onEdit }: CategoryListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEditing = (id: string) => {
    if (editingName.trim()) {
      onEdit(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-2 bg-background rounded-lg"
        >
          {editingId === category.id ? (
            <div className="flex items-center gap-2 flex-1 mr-2">
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => saveEditing(category.id)}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelEditing}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <>
              <span>{category.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditing(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer la catégorie "{category.name}" ?
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(category.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};