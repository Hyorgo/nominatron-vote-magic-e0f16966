export interface HomeContent {
  id: string;
  section_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  is_active: boolean;
  display_order: number;
}

export interface HomeContentFormData {
  section_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  display_order?: number;
  is_active?: boolean;
}