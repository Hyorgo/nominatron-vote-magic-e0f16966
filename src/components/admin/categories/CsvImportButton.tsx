import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
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
          console.log("Résultats du parsing CSV:", results);
          const rows = results.data as CsvRow[];
          if (validateCsvData(rows)) {
            resolve(rows);
          } else {
            reject(new Error("Format CSV invalide - Assurez-vous d'avoir les colonnes category_name, nominee_name, et nominee_description"));
          }
        },
        error: (error) => {
          console.error("Erreur lors du parsing CSV:", error);
          reject(error);
        },
      });
    });
  };

  const validateCsvData = (rows: CsvRow[]): boolean => {
    if (!Array.isArray(rows) || rows.length === 0) {
      console.error("Le fichier CSV est vide ou n'est pas un tableau");
      return false;
    }

    return rows.every((row) => {
      const hasRequiredFields = 
        row.category_name?.trim() &&
        row.nominee_name?.trim() &&
        row.nominee_description?.trim();
      
      if (!hasRequiredFields) {
        console.error("Ligne invalide:", row);
      }
      return hasRequiredFields;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("Aucun fichier sélectionné");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Début du traitement du fichier CSV");
      const rows = await processFile(file);
      console.log("Données CSV validées:", rows);
      
      // Créer un Map pour stocker les catégories uniques et leur ordre
      const categories = new Map<string, number>();
      rows.forEach((row) => {
        if (!categories.has(row.category_name)) {
          categories.set(row.category_name, categories.size + 1);
        }
      });

      console.log("Catégories uniques:", Array.from(categories.entries()));

      // Insérer les catégories
      for (const [categoryName, displayOrder] of categories) {
        console.log(`Insertion de la catégorie: ${categoryName}`);
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

        if (categoryError) {
          console.error("Erreur lors de l'insertion de la catégorie:", categoryError);
          throw categoryError;
        }

        console.log("Catégorie insérée avec succès:", categoryData);

        // Insérer les nominés pour cette catégorie
        const nomineesForCategory = rows.filter(
          (row) => row.category_name === categoryName
        );

        for (const nominee of nomineesForCategory) {
          console.log(`Insertion du nominé: ${nominee.nominee_name}`);
          const { error: nomineeError } = await supabase
            .from("nominees")
            .insert([
              {
                category_id: categoryData.id,
                name: nominee.nominee_name,
                description: nominee.nominee_description,
              },
            ]);

          if (nomineeError) {
            console.error("Erreur lors de l'insertion du nominé:", nomineeError);
            throw nomineeError;
          }
        }
      }

      toast({
        title: "Import réussi",
        description: "Les catégories et nominés ont été importés avec succès.",
      });
      onSuccess();
    } catch (error) {
      console.error("Erreur détaillée lors de l'import:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'import du fichier CSV.",
      });
    } finally {
      setIsLoading(false);
      // Réinitialiser l'input file
      event.target.value = "";
    }
  };

  const downloadExample = () => {
    const exampleData = [
      {
        category_name: "Meilleur Film",
        nominee_name: "Inception",
        nominee_description: "Un film sur les rêves et la réalité",
      },
      {
        category_name: "Meilleur Film",
        nominee_name: "The Dark Knight",
        nominee_description: "L'histoire du Chevalier Noir de Gotham",
      },
      {
        category_name: "Meilleur Acteur",
        nominee_name: "Leonardo DiCaprio",
        nominee_description: "Pour son rôle dans Inception",
      },
      {
        category_name: "Meilleur Acteur",
        nominee_name: "Christian Bale",
        nominee_description: "Pour son rôle dans The Dark Knight",
      },
    ];

    const csv = Papa.unparse(exampleData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "exemple_categories_nomines.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Button
        variant="outline"
        onClick={downloadExample}
        className="cursor-pointer"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger un exemple
      </Button>
    </div>
  );
};