import { supabase } from "@/integrations/supabase/client";
import { CsvRow } from "../types/csvTypes";

export const importCsvToSupabase = async (rows: CsvRow[]): Promise<void> => {
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
};