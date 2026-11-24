export type DestinationCategory =
  | 'Forts & Heritage'
  | 'Waterfalls & Nature'
  | 'Spiritual & Landmarks';

export type DestinationFilter = 'All' | DestinationCategory;

export interface Destination {
  id: string;
  name: string;
  category: DestinationCategory;
  secondaryCategory?: DestinationCategory;
  distanceFromCity: string;
  bestSeason: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  estimatedHours: number;
}

export interface FoodItem {
  id: string;
  name: string;
  dietary: 'Veg' | 'Non-Veg / Veg';
  type: string;
  origin: string;
  description: string;
  imageUrl: string;
}

export interface ArtCraftItem {
  id: string;
  name: string;
  cluster: string;
  craftType: string;
  description: string;
  imageUrl: string;
}

export interface CulturalActivity {
  id: string;
  name: string;
  season: string;
  tradition: string;
  description: string;
  imageUrl: string;
}

export type GalleryCategory = 'Heritage' | 'Nature' | 'Food' | 'Culture';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  imageUrl: string;
  createdAt: string;
  isCustom?: boolean;
}

export type ExperiencePreference =
  | 'Local Food Trail'
  | 'Heritage & Fort Walk'
  | 'Art & Handicraft Shopping'
  | 'Nature & Waterfall Trek';

export type TripDuration = '1 Day' | '2 Days / 1 Night' | '3 Days / 2 Nights';

export type BudgetRange = 'Budget' | 'Standard' | 'Premium';

export type TripStatus = 'Pending' | 'Confirmed' | 'Completed';

export interface CreateTripPayload {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  duration: TripDuration;
  travelers: number;
  budget: BudgetRange;
  selectedDestinations: string[];
  experiences: ExperiencePreference[];
  notes: string;
}

export interface TripRequest extends CreateTripPayload {
  id: string;
  bookingId: string;
  status: TripStatus;
  createdAt: string;
}

export interface CreateGalleryPhotoPayload {
  title: string;
  category: GalleryCategory;
  caption: string;
  imageUrl: string;
}

export interface VisitorReview {
  id: string;
  visitorName: string;
  originCity: string;
  rating: number;
  visitedLandmark: string;
  comment: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  visitorName: string;
  originCity: string;
  rating: number;
  visitedLandmark: string;
  comment: string;
}

export type StorageBackendMode = 'supabase' | 'localStorage';

export interface SiteContentResponse {
  destinations: Destination[];
  food: FoodItem[];
  art: ArtCraftItem[];
  culture: CulturalActivity[];
  gallery: GalleryPhoto[];
}
