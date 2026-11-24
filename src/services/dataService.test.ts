import test from 'node:test';
import assert from 'node:assert/strict';
import { createDataService, type StorageLike } from './dataService';

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

test('dataService falls back to localStorage with seeded trips, gallery, and 3 reviews', async () => {
  const storage = createMemoryStorage();
  const svc = createDataService({ supabaseClient: null, storage });

  assert.equal(svc.getBackendMode(), 'localStorage');

  const content = await svc.getContent();
  assert.equal(content.destinations.length, 6);
  assert.equal(content.gallery.length, 10);

  const trips = await svc.listTrips();
  assert.equal(trips.length, 2);

  const reviews = await svc.listReviews();
  assert.equal(reviews.length, 3);
});

test('dataService persists created trips, status updates, reviews, and gallery photos in localStorage fallback', async () => {
  const storage = createMemoryStorage();
  const svc1 = createDataService({ supabaseClient: null, storage });

  const tripRes = await svc1.createTrip({
    fullName: 'Deepak Kulkarni',
    email: 'deepak@example.com',
    phone: '+91 98450 55443',
    preferredDate: '2026-12-21',
    duration: '2 Days / 1 Night',
    travelers: 2,
    budget: 'Standard',
    selectedDestinations: ['Gokak Falls'],
    experiences: ['Local Food Trail'],
    notes: 'Morning slot',
  });
  assert.ok(tripRes.trip);
  assert.match(tripRes.trip.bookingId, /^BGM-2026-\d{4}$/);

  const updated = await svc1.updateTripStatus(tripRes.trip.id, 'Confirmed');
  assert.equal(updated?.status, 'Confirmed');

  const reviewRes = await svc1.createReview({
    visitorName: 'Sneha Nair',
    originCity: 'Mumbai, Maharashtra',
    rating: 5,
    visitedLandmark: 'Godchinamalaki Falls',
    comment: 'Two-tier cascades surrounded by peaceful green forest.',
  });
  assert.ok(reviewRes.review);

  const photoRes = await svc1.addGalleryPhoto({
    title: 'Sunset at Yellur',
    category: 'Heritage',
    caption: 'Warm light on Rajhansgad.',
    imageUrl: 'https://example.com/yellur.jpg',
  });
  assert.ok(photoRes.photo);

  // Re-instantiate service against same storage to verify persistence
  const svc2 = createDataService({ supabaseClient: null, storage });
  const reloadedTrips = await svc2.listTrips();
  assert.equal(
    reloadedTrips.find((t) => t.id === tripRes.trip?.id)?.status,
    'Confirmed'
  );
  const reloadedReviews = await svc2.listReviews();
  assert.equal(reloadedReviews.length, 4);
  const reloadedGallery = (await svc2.getContent()).gallery;
  assert.equal(reloadedGallery.length, 11);

  assert.equal(await svc2.deleteTrip(tripRes.trip.id), true);
  assert.equal(await svc2.deleteReview(reviewRes.review.id), true);
  assert.equal(await svc2.deleteGalleryPhoto(photoRes.photo.id), true);
});
