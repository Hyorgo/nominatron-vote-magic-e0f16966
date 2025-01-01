import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AddNomineeForm } from "./nominees/AddNomineeForm";
import { NomineesList } from "./nominees/NomineesList";
import { useNomineesManager } from "@/hooks/useNomineesManager";

export const NomineesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const { categories, loading, fetchData, addNominee, deleteNominee } = useNomineesManager(onUpdate);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Gestion des nominés</h3>
      <AddNomineeForm categories={categories} onSubmit={addNominee} />
      <NomineesList categories={categories} onDelete={deleteNominee} />
    </Card>
  );
};