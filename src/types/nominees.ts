export interface Nominee {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category_id: string | null;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  display_order: number;
  nominees: Nominee[];
}