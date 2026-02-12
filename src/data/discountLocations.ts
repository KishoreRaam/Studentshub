export interface Deal {
  id: number;
  name: string;
  category: string;
  emoji: string;
  discount: number;
  distance: string;
  lat: number;
  lng: number;
  bgColor: string;
}

export const dealsData: Deal[] = [
  { id: 1, name: "CopyQuick Print Hub", category: "Print", emoji: "📄", discount: 30, distance: "0.2 km", lat: 13.0650, lng: 80.2550, bgColor: "#ebf2ff" },
  { id: 2, name: "Bean & Brew Café", category: "Café", emoji: "☕", discount: 20, distance: "0.3 km", lat: 13.0580, lng: 80.2700, bgColor: "#fffbeb" },
  { id: 3, name: "Campus Stationery", category: "Stationery", emoji: "📐", discount: 15, distance: "0.5 km", lat: 13.0520, lng: 80.2480, bgColor: "#f5f3ff" },
  { id: 4, name: "Dosa Palace", category: "Food", emoji: "🍕", discount: 25, distance: "0.4 km", lat: 13.0490, lng: 80.2620, bgColor: "#fef2f2" },
  { id: 5, name: "StudyMart Retail", category: "Retail", emoji: "🛒", discount: 40, distance: "0.8 km", lat: 13.0680, lng: 80.2780, bgColor: "#ecfdf5" },
  { id: 6, name: "MedPlus Pharmacy", category: "Medical", emoji: "💊", discount: 10, distance: "0.6 km", lat: 13.0620, lng: 80.2420, bgColor: "#fdf2f8" },
  { id: 7, name: "QuickRide Autos", category: "Transport", emoji: "🚌", discount: 15, distance: "1.2 km", lat: 13.0540, lng: 80.2800, bgColor: "#f0f9ff" },
  { id: 8, name: "Chai Sutta Bar", category: "Café", emoji: "☕", discount: 35, distance: "0.3 km", lat: 13.0560, lng: 80.2580, bgColor: "#fffbeb" },
  { id: 9, name: "PrintAll Express", category: "Print", emoji: "📄", discount: 20, distance: "0.7 km", lat: 13.0470, lng: 80.2510, bgColor: "#ebf2ff" },
  { id: 10, name: "Biryani House", category: "Food", emoji: "🍕", discount: 18, distance: "0.9 km", lat: 13.0450, lng: 80.2680, bgColor: "#fef2f2" },
  { id: 11, name: "Tech Supplies Co.", category: "Stationery", emoji: "📐", discount: 22, distance: "1 km", lat: 13.0500, lng: 80.2380, bgColor: "#f5f3ff" },
  { id: 12, name: "Green Grocers", category: "Retail", emoji: "🛒", discount: 12, distance: "0.4 km", lat: 13.0700, lng: 80.2650, bgColor: "#ecfdf5" },
];

export const categories = [
  { label: "All", emoji: "", value: "All" },
  { label: "Print", emoji: "📄", value: "Print" },
  { label: "Café", emoji: "☕", value: "Café" },
  { label: "Stationery", emoji: "📐", value: "Stationery" },
  { label: "Food", emoji: "🍕", value: "Food" },
  { label: "Retail", emoji: "🛒", value: "Retail" },
  { label: "Medical", emoji: "💊", value: "Medical" },
  { label: "Transport", emoji: "🚌", value: "Transport" },
];

export function toGeoJSON(data: Deal[] = dealsData): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: data.map((deal) => ({
      type: "Feature",
      properties: {
        id: deal.id,
        name: deal.name,
        category: deal.category,
        discount: deal.discount,
        weight: deal.discount / 100,
      },
      geometry: {
        type: "Point",
        coordinates: [deal.lng, deal.lat],
      },
    })),
  };
}
