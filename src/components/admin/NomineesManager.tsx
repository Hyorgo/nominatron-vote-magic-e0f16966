import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CategoryForm } from "./categories/CategoryForm";
import { DeleteAllButton } from "./categories/DeleteAllButton";
import { NomineesList } from "./nominees/NomineesList";
import { EditNomineeDialog } from "./nominees/EditNomineeDialog";
import { useNomineesManager } from "@/hooks/useNomineesManager";

export const NomineesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const {
    categories,
    loading,
    editingNominee,
    setEditingNominee,
    addNominee,
    updateNominee,
    deleteNominee,
  } = useNomineesManager(onUpdate);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gestion des nominés</h3>
        {/* Nous passons maintenant une fonction qui appelle deleteNominee avec l'ID */}
        <DeleteAllButton 
          isLoading={loading} 
          onDelete={() => deleteNominee('')} 
        />
      </div>
      
      <CategoryForm
        newCategoryName=""
        onNameChange={() => {}}
        onSubmit={() => {}}
      />

      <NomineesList 
        categories={categories} 
        onDelete={deleteNominee}
        onEdit={setEditingNominee}
      />
      
      <EditNomineeDialog
        nominee={editingNominee}
        categories={categories}
        onClose={() => setEditingNominee(null)}
        onSubmit={updateNominee}
      />
    </Card>
  );
};