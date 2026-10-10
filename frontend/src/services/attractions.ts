export async function getAttractions() {
  const response = await fetch(
    "http://localhost:3000/api/attractions"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch attractions");
  }

  return response.json();
}