export type ItineraryDuration = '1-dia' | '3-dias' | '5-dias' | 'tematico';
export type ItineraryPace = 'tranquilo' | 'moderado' | 'intenso';

export interface ItineraryStop {
  timeSlot: string; // Ex: "05:15 - 07:30"
  placeId?: string; // ID do mockPlaces (se houver correspondente)
  title: string;
  location: string;
  description: string;
  secretTip: string;
  image: string;
  durationEst: string; // Ex: "2 horas"
  costEst: string; // Ex: "Gratuito" ou "R$ 45,00"
  coordinates?: { lat: number; lng: number };
}

export interface ItineraryDay {
  dayNumber: number;
  dayTitle: string; // Ex: "Dia 1: O Encanto da Orla & Piscinas de Picãozinho"
  summary: string;
  stops: ItineraryStop[];
}

export interface Itinerary {
  id: string;
  slug: string;
  title: string;
  slogan: string;
  durationLabel: string; // Ex: "1 Dia (Express)"
  durationCategory: ItineraryDuration;
  daysCount: number;
  pace: ItineraryPace;
  estimatedCost: string; // Ex: "A partir de R$ 120/pessoa"
  featuredImage: string;
  highlights: string[];
  description: string;
  days: ItineraryDay[];
  tags: string[];
  isPremium: boolean;
}
