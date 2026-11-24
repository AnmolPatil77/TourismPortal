import type {
  BudgetRange,
  CreateGalleryPhotoPayload,
  CreateReviewPayload,
  CreateTripPayload,
  Destination,
  DestinationFilter,
  ExperiencePreference,
  GalleryCategory,
  TripDuration,
  TripStatus,
} from '../types';

export const ALLOWED_DURATIONS: readonly TripDuration[] = [
  '1 Day',
  '2 Days / 1 Night',
  '3 Days / 2 Nights',
];

export const ALLOWED_BUDGETS: readonly BudgetRange[] = ['Budget', 'Standard', 'Premium'];

export const ALLOWED_STATUSES: readonly TripStatus[] = ['Pending', 'Confirmed', 'Completed'];

export const ALLOWED_EXPERIENCES: readonly ExperiencePreference[] = [
  'Local Food Trail',
  'Heritage & Fort Walk',
  'Art & Handicraft Shopping',
  'Nature & Waterfall Trek',
];

export const ALLOWED_GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  'Heritage',
  'Nature',
  'Food',
  'Culture',
];

export function filterDestinations(
  destinations: Destination[],
  filter: DestinationFilter
): Destination[] {
  if (filter === 'All') {
    return destinations;
  }
  return destinations.filter(
    (dest) => dest.category === filter || dest.secondaryCategory === filter
  );
}

export function generateBookingId(
  year = 2026,
  randomFn: () => number = Math.random
): string {
  const num = Math.floor(1000 + randomFn() * 9000);
  return `BGM-${year}-${num}`;
}

export interface TripValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateTripForm(payload: Partial<CreateTripPayload>): TripValidationResult {
  const errors: Record<string, string> = {};

  const fullName = (payload.fullName ?? '').trim();
  if (fullName.length < 2 || fullName.length > 120) {
    errors.fullName = 'Please enter your full name (2–120 characters).';
  }

  const email = (payload.email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    errors.email = 'Please enter a valid email address.';
  }

  const phoneRaw = (payload.phone ?? '').trim();
  const digits = phoneRaw.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = 'Please enter a valid 10–15 digit phone number.';
  }

  const preferredDate = (payload.preferredDate ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    errors.preferredDate = 'Please select a preferred travel date.';
  }

  if (!payload.duration || !ALLOWED_DURATIONS.includes(payload.duration)) {
    errors.duration = 'Please select a valid trip duration.';
  }

  const travelers = Number(payload.travelers);
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) {
    errors.travelers = 'Number of travelers must be between 1 and 50.';
  }

  if (!payload.budget || !ALLOWED_BUDGETS.includes(payload.budget)) {
    errors.budget = 'Please choose a budget range.';
  }

  if (!Array.isArray(payload.selectedDestinations) || payload.selectedDestinations.length === 0) {
    errors.selectedDestinations = 'Please select at least one Belagavi destination.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isSafeImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('/src/assets/')) {
    return !trimmed.includes('..');
  }

  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed.length <= 6_500_000;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validatePhotoPayload(
  payload: Partial<CreateGalleryPhotoPayload>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const title = (payload.title ?? '').trim();
  if (title.length < 2 || title.length > 100) {
    errors.title = 'Please provide a title (2–100 characters).';
  }

  if (!payload.category || !ALLOWED_GALLERY_CATEGORIES.includes(payload.category)) {
    errors.category = 'Please choose a valid gallery category.';
  }

  const imageUrl = (payload.imageUrl ?? '').trim();
  if (!isSafeImageUrl(imageUrl)) {
    errors.imageUrl = 'Provide a valid http(s) image URL or upload an image file (max 4.5 MB).';
  }

  const caption = (payload.caption ?? '').trim();
  if (caption.length > 260) {
    errors.caption = 'Caption must be 260 characters or fewer.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface TripSummary {
  destinationNames: string[];
  destinationCount: number;
  experienceCount: number;
  estimatedExplorationHours: number;
  recommendedDurationLabel: TripDuration;
}

export function buildTripSummary(
  selectedNamesOrIds: string[],
  destinations: Destination[],
  experiences: ExperiencePreference[],
  duration: TripDuration
): TripSummary {
  const matched = destinations.filter(
    (d) => selectedNamesOrIds.includes(d.id) || selectedNamesOrIds.includes(d.name)
  );
  const destinationNames = matched.map((d) => d.name);
  const estimatedExplorationHours = matched.reduce((acc, d) => acc + d.estimatedHours, 0);

  let recommendedDurationLabel: TripDuration = duration;
  if (matched.length >= 5) {
    recommendedDurationLabel = '3 Days / 2 Nights';
  } else if (matched.length >= 3 && duration === '1 Day') {
    recommendedDurationLabel = '2 Days / 1 Night';
  }

  return {
    destinationNames,
    destinationCount: matched.length,
    experienceCount: experiences.length,
    estimatedExplorationHours,
    recommendedDurationLabel,
  };
}

export function validateReviewForm(
  payload: Partial<CreateReviewPayload>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const visitorName = (payload.visitorName ?? '').trim();
  if (visitorName.length < 2 || visitorName.length > 80) {
    errors.visitorName = 'Please enter your name (2–80 characters).';
  }

  const originCity = (payload.originCity ?? '').trim();
  if (originCity.length < 2 || originCity.length > 80) {
    errors.originCity = 'Please enter your city (e.g. Pune, Maharashtra).';
  }

  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = 'Please select a star rating between 1 and 5.';
  }

  const visitedLandmark = (payload.visitedLandmark ?? '').trim();
  if (visitedLandmark.length < 2) {
    errors.visitedLandmark = 'Please select the landmark you visited.';
  }

  const comment = (payload.comment ?? '').trim();
  if (comment.length < 10 || comment.length > 500) {
    errors.comment = 'Please write a short review (10–500 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

