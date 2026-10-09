// شكل بيانات المعلم السياحي

export type AttractionCategory = 'historical' | 'natural' | 'cultural' | 'adventure';

export interface Attraction {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: AttractionCategory;
  image: string;
  rating: number;
  reviews: number;
  price: number; // 0 = مجاني
  location: string;
  locationAr: string;
}
