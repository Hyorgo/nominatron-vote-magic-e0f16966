import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

interface CsvRow {
  category_name: string;
  nominee_name: string;
  nominee_description: string;
}

interface CsvImportButtonProps {
  onSuccess: () => void;
}

export const CsvImportButton = ({ onSuccess }: CsvImportButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    return new Promise<CsvRow[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as CsvRow[];
          if (validateCsvData(rows)) {
            resolve(rows);
          } else {
            reject(new Error("Format CSV invalide"));
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const validateCsvData = (rows: CsvRow[]): boolean => {
    return rows.every(
      (row) =>
        row.category_name &&
        row.nominee_name &&
        row.nominee_description
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const rows = await processFile(file);
      
      // Créer un Map pour stocker les catégories uniques et leur ordre
      const categories = new Map<string, number>();
      rows.forEach((row) => {
        if (!categories.has(row.category_name)) {
          categories.set(row.category_name, categories.size + 1);
        }
      });

      // Insérer les catégories
      for (const [categoryName, displayOrder] of categories) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .insert([
            {
              name: categoryName,
              display_order: displayOrder,
            },
          ])
          .select()
          .single();

        if (categoryError) throw categoryError;

        // Insérer les nominés pour cette catégorie
        const nomineesForCategory = rows.filter(
          (row) => row.category_name === categoryName
        );

        for (const nominee of nomineesForCategory) {
          const { error: nomineeError } = await supabase
            .from("nominees")
            .insert([
              {
                category_id: categoryData.id,
                name: nominee.nominee_name,
                description: nominee.nominee_description,
              },
            ]);

          if (nomineeError) throw nomineeError;
        }
      }

      toast({
        title: "Import réussi",
        description: "Les catégories et nominés ont été importés avec succès.",
      });
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import du fichier CSV.",
      });
    } finally {
      setIsLoading(false);
      // Réinitialiser l'input file
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
        disabled={isLoading}
      />
      <label htmlFor="csv-upload">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={isLoading}
          asChild
        >
          <span>
            <Upload className="h-4 w-4 mr-2" />
            Importer CSV
          </span>
        </Button>
      </label>
    </div>
  );
};