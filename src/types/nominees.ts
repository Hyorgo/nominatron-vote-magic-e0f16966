export interface Nominee {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category_id: string | null;
  created_at?: string;
  categoryName?: string; // Ajout de la propriété optionnelle
}

export interface Category {
  id: string;
  name: string;
  display_order: number;
  nominees: Nominee[];
}