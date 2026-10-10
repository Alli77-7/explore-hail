import type {
  Attraction,
  AttractionCategory,
} from "../features/attractions/attractions.types";

interface ApiAttraction {
  id: number;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  google_map_url: string | null;
  category: AttractionCategory;
  rating: number | string | null;
  price: number | string | null;
  image_url: string | null;
  has_inscriptions: boolean | number;
}

export async function getAttractions(): Promise<Attraction[]> {
  const response = await fetch(
    "http://localhost:3000/api/attractions"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch attractions");
  }

  const data: ApiAttraction[] = await response.json();

  return data.map((item) => ({
    id: String(item.id),

    name: item.name,
    nameAr: item.name_ar ?? item.name,

    description: item.description ?? "",
    descriptionAr: item.description_ar ?? item.description ?? "",

    category: item.category,

    image: item.image_url
      ? `http://localhost:3000${item.image_url}`
      : "",

    rating:
      item.rating !== null
        ? Number(item.rating)
        : undefined,

    price:
      item.price !== null
        ? Number(item.price)
        : undefined,

    reviews: 0,

    location: "",
    locationAr: "",

    googleMapsUrl: item.google_map_url ?? "",
  }));
}