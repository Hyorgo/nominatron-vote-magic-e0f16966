export interface Nominee {
  id: string;
  name: string;
  description: string;
  category_id: string;
  image_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  nominees: Nominee[];
}