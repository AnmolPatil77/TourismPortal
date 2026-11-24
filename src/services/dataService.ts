import type { SupabaseClient } from '@supabase/supabase-js';
import {
  SEED_ART,
  SEED_CULTURE,
  SEED_DESTINATIONS,
  SEED_FOOD,
  SEED_GALLERY,
  SEED_REVIEWS,
  SEED_TRIPS,
} from '../data/belagaviContent';
import { supabase as defaultSupabase } from '../lib/supabaseClient';
import type {
  CreateGalleryPhotoPayload,
  CreateReviewPayload,
  CreateTripPayload,
  GalleryPhoto,
  SiteContentResponse,
  StorageBackendMode,
  TripRequest,
  TripStatus,
  VisitorReview,
} from '../types';
import {
  ALLOWED_STATUSES,
  generateBookingId,
  validatePhotoPayload,
  validateReviewForm,
  validateTripForm,
} from '../utils/tripHelpers';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEYS = {
  trips: 'belagavi_trip_bookings_v1',
  gallery: 'belagavi_gallery_photos_v1',
  reviews: 'belagavi_visitor_reviews_v1',
} as const;

function getBrowserStorage(): StorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Ignore restricted storage environments
  }
  return null;
}

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

interface TripBookingRow {
  id: string;
  booking_id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  duration: TripRequest['duration'];
  travelers: number;
  budget: TripRequest['budget'];
  selected_destinations: string[] | null;
  experiences: TripRequest['experiences'] | null;
  notes: string | null;
  status: TripStatus;
  created_at: string;
}

interface GalleryPhotoRow {
  id: string;
  title: string;
  category: GalleryPhoto['category'];
  caption: string | null;
  image_url: string;
  is_custom: boolean | null;
  created_at: string;
}

interface ReviewRow {
  id: string;
  visitor_name: string;
  origin_city: string;
  rating: number;
  visited_landmark: string;
  comment: string;
  created_at: string;
}

function mapTripRow(row: TripBookingRow): TripRequest {
  return {
    id: row.id,
    bookingId: row.booking_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    preferredDate: row.preferred_date,
    duration: row.duration,
    travelers: Number(row.travelers),
    budget: row.budget,
    selectedDestinations: Array.isArray(row.selected_destinations)
      ? row.selected_destinations
      : [],
    experiences: Array.isArray(row.experiences) ? row.experiences : [],
    notes: row.notes ?? '',
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapGalleryRow(row: GalleryPhotoRow): GalleryPhoto {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    caption: row.caption ?? '',
    imageUrl: row.image_url,
    isCustom: Boolean(row.is_custom),
    createdAt: row.created_at,
  };
}

function mapReviewRow(row: ReviewRow): VisitorReview {
  return {
    id: row.id,
    visitorName: row.visitor_name,
    originCity: row.origin_city,
    rating: Number(row.rating),
    visitedLandmark: row.visited_landmark,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export function createDataService(options?: {
  supabaseClient?: SupabaseClient | null;
  storage?: StorageLike | null;
}) {
  const client =
    options?.supabaseClient !== undefined
      ? options.supabaseClient
      : defaultSupabase;
  const storage =
    options?.storage !== undefined ? options.storage : getBrowserStorage();

  const memoryFallback: Record<string, string> = {};

  function readLocalList<T>(key: string, seed: T[]): T[] {
    try {
      const raw = storage ? storage.getItem(key) : memoryFallback[key] ?? null;
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          return parsed as T[];
        }
      }
    } catch {
      // Fall back to seed below
    }
    writeLocalList(key, seed);
    return [...seed];
  }

  function writeLocalList<T>(key: string, items: T[]): void {
    const serialized = JSON.stringify(items);
    if (storage) {
      try {
        storage.setItem(key, serialized);
        return;
      } catch {
        // Fall through to in-memory cache if quota exceeded
      }
    }
    memoryFallback[key] = serialized;
  }

  function sortByNewest<T extends { createdAt: string }>(items: T[]): T[] {
    return [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  function getBackendMode(): StorageBackendMode {
    return client ? 'supabase' : 'localStorage';
  }

  async function listGallery(): Promise<GalleryPhoto[]> {
    if (client) {
      try {
        const { data, error } = await client
          .from('gallery_photos')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          if (data.length > 0) {
            return (data as GalleryPhotoRow[]).map(mapGalleryRow);
          }
          // If table exists but empty, still show curated local gallery merged
          return sortByNewest(SEED_GALLERY);
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }
    return sortByNewest(readLocalList<GalleryPhoto>(STORAGE_KEYS.gallery, SEED_GALLERY));
  }

  async function getContent(): Promise<SiteContentResponse> {
    const gallery = await listGallery();
    return {
      destinations: SEED_DESTINATIONS,
      food: SEED_FOOD,
      art: SEED_ART,
      culture: SEED_CULTURE,
      gallery,
    };
  }

  async function listTrips(): Promise<TripRequest[]> {
    if (client) {
      try {
        const { data, error } = await client
          .from('trip_bookings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          return (data as TripBookingRow[]).map(mapTripRow);
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }
    return sortByNewest(readLocalList<TripRequest>(STORAGE_KEYS.trips, SEED_TRIPS));
  }

  async function createTrip(
    payload: CreateTripPayload
  ): Promise<{ trip?: TripRequest; errors?: Record<string, string> }> {
    const validation = validateTripForm(payload);
    if (!validation.valid) {
      return { errors: validation.errors };
    }

    const existingTrips = readLocalList<TripRequest>(STORAGE_KEYS.trips, SEED_TRIPS);
    const existingIds = new Set(existingTrips.map((t) => t.bookingId));
    let bookingId = generateBookingId(2026);
    while (existingIds.has(bookingId)) {
      bookingId = generateBookingId(2026);
    }

    const normalized: Omit<TripRequest, 'id'> = {
      bookingId,
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      preferredDate: payload.preferredDate.trim(),
      duration: payload.duration,
      travelers: Number(payload.travelers),
      budget: payload.budget,
      selectedDestinations: payload.selectedDestinations
        .map((d) => String(d).trim())
        .filter(Boolean),
      experiences: Array.isArray(payload.experiences) ? payload.experiences : [],
      notes: (payload.notes ?? '').trim().slice(0, 1000),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    if (client) {
      try {
        const { data, error } = await client
          .from('trip_bookings')
          .insert({
            booking_id: normalized.bookingId,
            full_name: normalized.fullName,
            email: normalized.email,
            phone: normalized.phone,
            preferred_date: normalized.preferredDate,
            duration: normalized.duration,
            travelers: normalized.travelers,
            budget: normalized.budget,
            selected_destinations: normalized.selectedDestinations,
            experiences: normalized.experiences,
            notes: normalized.notes,
            status: normalized.status,
          })
          .select('*')
          .single();

        if (!error && data) {
          return { trip: mapTripRow(data as TripBookingRow) };
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }

    const localTrip: TripRequest = {
      id: createId('trip'),
      ...normalized,
    };
    writeLocalList(STORAGE_KEYS.trips, [localTrip, ...existingTrips]);
    return { trip: localTrip };
  }

  async function updateTripStatus(
    id: string,
    status: TripStatus
  ): Promise<TripRequest | null> {
    if (!ALLOWED_STATUSES.includes(status)) {
      return null;
    }

    if (client) {
      try {
        const { data, error } = await client
          .from('trip_bookings')
          .update({ status })
          .eq('id', id)
          .select('*')
          .single();
        if (!error && data) {
          return mapTripRow(data as TripBookingRow);
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }

    const trips = readLocalList<TripRequest>(STORAGE_KEYS.trips, SEED_TRIPS);
    const idx = trips.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const updated = { ...trips[idx], status };
    trips[idx] = updated;
    writeLocalList(STORAGE_KEYS.trips, trips);
    return updated;
  }

  async function deleteTrip(id: string): Promise<boolean> {
    if (client) {
      try {
        const { error } = await client
          .from('trip_bookings')
          .delete()
          .eq('id', id);
        if (!error) {
          return true;
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }

    const trips = readLocalList<TripRequest>(STORAGE_KEYS.trips, SEED_TRIPS);
    const filtered = trips.filter((t) => t.id !== id);
    if (filtered.length === trips.length) return false;
    writeLocalList(STORAGE_KEYS.trips, filtered);
    return true;
  }

  async function addGalleryPhoto(
    payload: CreateGalleryPhotoPayload
  ): Promise<{ photo?: GalleryPhoto; errors?: Record<string, string> }> {
    const validation = validatePhotoPayload(payload);
    if (!validation.valid) {
      return { errors: validation.errors };
    }

    const normalized = {
      title: payload.title.trim(),
      category: payload.category,
      caption: (payload.caption ?? '').trim() || `${payload.category} view from Belagavi.`,
      imageUrl: payload.imageUrl.trim(),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    if (client) {
      try {
        const { data, error } = await client
          .from('gallery_photos')
          .insert({
            title: normalized.title,
            category: normalized.category,
            caption: normalized.caption,
            image_url: normalized.imageUrl,
            is_custom: true,
          })
          .select('*')
          .single();
        if (!error && data) {
          return { photo: mapGalleryRow(data as GalleryPhotoRow) };
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }

    const existing = readLocalList<GalleryPhoto>(STORAGE_KEYS.gallery, SEED_GALLERY);
    const localPhoto: GalleryPhoto = {
      id: createId('gal'),
      ...normalized,
    };
    writeLocalList(STORAGE_KEYS.gallery, [localPhoto, ...existing]);
    return { photo: localPhoto };
  }

  async function deleteGalleryPhoto(id: string): Promise<boolean> {
    if (client) {
      try {
        const { error } = await client
          .from('gallery_photos')
          .delete()
          .eq('id', id);
        if (!error) {
          return true;
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }

    const existing = readLocalList<GalleryPhoto>(STORAGE_KEYS.gallery, SEED_GALLERY);
    const filtered = existing.filter((p) => p.id !== id);
    if (filtered.length === existing.length) return false;
    writeLocalList(STORAGE_KEYS.gallery, filtered);
    return true;
  }

  async function listReviews(): Promise<VisitorReview[]> {
    if (client) {
      try {
        const { data, error } = await client
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          return (data as ReviewRow[]).map(mapReviewRow);
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }
    return sortByNewest(readLocalList<VisitorReview>(STORAGE_KEYS.reviews, SEED_REVIEWS));
  }

  async function createReview(
    payload: CreateReviewPayload
  ): Promise<{ review?: VisitorReview; errors?: Record<string, string> }> {
    const validation = validateReviewForm(payload);
    if (!validation.valid) {
      return { errors: validation.errors };
    }

    const normalized = {
      visitorName: payload.visitorName.trim(),
      originCity: payload.originCity.trim(),
      rating: Number(payload.rating),
      visitedLandmark: payload.visitedLandmark.trim(),
      comment: payload.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    if (client) {
      try {
        const { data, error } = await client
          .from('reviews')
          .insert({
            visitor_name: normalized.visitorName,
            origin_city: normalized.originCity,
            rating: normalized.rating,
            visited_landmark: normalized.visitedLandmark,
            comment: normalized.comment,
          })
          .select('*')
          .single();
        if (!error && data) {
          return { review: mapReviewRow(data as ReviewRow) };
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }

    const existing = readLocalList<VisitorReview>(STORAGE_KEYS.reviews, SEED_REVIEWS);
    const localReview: VisitorReview = {
      id: createId('rev'),
      ...normalized,
    };
    writeLocalList(STORAGE_KEYS.reviews, [localReview, ...existing]);
    return { review: localReview };
  }

  async function deleteReview(id: string): Promise<boolean> {
    if (client) {
      try {
        const { error } = await client.from('reviews').delete().eq('id', id);
        if (!error) {
          return true;
        }
      } catch {
        // Fall back gracefully to localStorage
      }
    }

    const existing = readLocalList<VisitorReview>(STORAGE_KEYS.reviews, SEED_REVIEWS);
    const filtered = existing.filter((r) => r.id !== id);
    if (filtered.length === existing.length) return false;
    writeLocalList(STORAGE_KEYS.reviews, filtered);
    return true;
  }

  return {
    getBackendMode,
    getContent,
    listTrips,
    createTrip,
    updateTripStatus,
    deleteTrip,
    addGalleryPhoto,
    deleteGalleryPhoto,
    listReviews,
    createReview,
    deleteReview,
  };
}

export const dataService = createDataService();
