import type { Attraction } from "../features/attractions/attractions.types";

export async function getAttractions(): Promise<Attraction[]> {
  const response = await fetch('/api/attractions');

  if (!response.ok) {
    throw new Error("Failed to fetch attractions");
  }

  return response.json();
}
