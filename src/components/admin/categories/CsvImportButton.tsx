import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { validateCsvData, validateCsvStructure } from "./utils/csvValidator";
import { importCsvToSupabase } from "./utils/supabaseImporter";
import { CsvRow } from "./types/csvTypes";

interface CsvImportButtonProps {
  onSuccess: () => void;
}

export const CsvImportButton = ({ onSuccess }: CsvImportButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File): Promise<CsvRow[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Résultats du parsing CSV:", results);
          
          // Vérifier la structure du CSV
          if (!validateCsvStructure(Object.keys(results.data[0] || {}))) {
            reject(new Error("Format CSV invalide - Assurez-vous d'avoir les colonnes category_name, nominee_name, et nominee_description"));
            return;
          }

          // Valider les données
          if (validateCsvData(results.data)) {
            resolve(results.data as CsvRow[]);
          } else {
            reject(new Error("Données CSV invalides - Vérifiez que toutes les lignes contiennent les informations requises"));
          }
        },
        error: (error) => {
          console.error("Erreur lors du parsing CSV:", error);
          reject(new Error("Erreur lors de la lecture du fichier CSV"));
        },
      });
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
      await importCsvToSupabase(rows);

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