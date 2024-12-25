export interface Nominee {
  id: string;
  name: string;
  description: string;
  category_id: string;
  image_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  nominees: Nominee[];
}