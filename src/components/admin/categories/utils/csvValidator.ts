import { CsvRow } from "../types/csvTypes";

export const validateCsvStructure = (headers: string[]): boolean => {
  const requiredColumns = ["category_name", "nominee_name", "nominee_description"];
  return requiredColumns.every(column => headers.includes(column));
};

export const validateCsvData = (rows: unknown[]): rows is CsvRow[] => {
  if (!Array.isArray(rows) || rows.length === 0) {
    console.error("Le fichier CSV est vide ou n'est pas un tableau");
    return false;
  }

  return rows.every((row: any) => {
    if (!row || typeof row !== 'object') {
      console.error("Ligne invalide (format incorrect):", row);
      return false;
    }

    const hasRequiredFields = 
      typeof row.category_name === 'string' && row.category_name.trim() &&
      typeof row.nominee_name === 'string' && row.nominee_name.trim() &&
      typeof row.nominee_description === 'string' && row.nominee_description.trim();
    
    if (!hasRequiredFields) {
      console.error("Ligne invalide (champs manquants):", row);
    }
    return hasRequiredFields;
  });
};