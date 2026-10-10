export type AttractionCategory =
  | "historical"
  | "natural"
  | "cultural"
  | "adventure";

export interface Attraction {
  id: number;

  name: string;
  name_ar: string | null;

  description: string | null;
  description_ar: string | null;

  google_map_url: string | null;

  latitude: number | null;
  longitude: number | null;

  category: AttractionCategory;

  image_url: string | null;

  rating: number | string | null;
  price: number | string | null;

  has_inscriptions: boolean | number;

  created_at: string;
}