import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTripSummary,
  filterDestinations,
  generateBookingId,
  isSafeImageUrl,
  validatePhotoPayload,
  validateReviewForm,
  validateTripForm,
} from './tripHelpers';
import type { Destination } from '../types';

const SAMPLE_DESTINATIONS: Destination[] = [
  {
    id: 'gokak-falls',
    name: 'Gokak Falls',
    category: 'Waterfalls & Nature',
    distanceFromCity: '60 km',
    bestSeason: 'Jul–Dec',
    description: 'Niagara of Karnataka.',
    highlights: ['Suspension Bridge'],
    imageUrl: '/src/assets/images/dest_gokak_falls_1795511401556.jpg',
    estimatedHours: 3,
  },
  {
    id: 'belagavi-fort',
    name: 'Belagavi Fort & Kamal Basti',
    category: 'Forts & Heritage',
    secondaryCategory: 'Spiritual & Landmarks',
    distanceFromCity: '2 km',
    bestSeason: 'Oct–Mar',
    description: '12th-century Ratta fort.',
    highlights: ['Kamal Basadi'],
    imageUrl: '/src/assets/images/dest_kamal_basti_1795511401772.jpg',
    estimatedHours: 2.5,
  },
  {
    id: 'kittur-fort',
    name: 'Kittur Rani Channamma Fort & Palace',
    category: 'Forts & Heritage',
    distanceFromCity: '48 km',
    bestSeason: 'Oct–Feb',
    description: 'Historic seat of Queen Channamma.',
    highlights: ['Museum'],
    imageUrl: '/src/assets/images/dest_kittur_fort_1795511401550.jpg',
    estimatedHours: 3,
  },
];

test('filterDestinations handles All, primary, and secondary spiritual categories', () => {
  assert.equal(filterDestinations(SAMPLE_DESTINATIONS, 'All').length, 3);
  assert.equal(filterDestinations(SAMPLE_DESTINATIONS, 'Waterfalls & Nature').length, 1);
  assert.equal(filterDestinations(SAMPLE_DESTINATIONS, 'Forts & Heritage').length, 2);
  const spiritual = filterDestinations(SAMPLE_DESTINATIONS, 'Spiritual & Landmarks');
  assert.equal(spiritual.length, 1);
  assert.equal(spiritual[0].id, 'belagavi-fort');
});

test('generateBookingId produces BGM-YYYY-XXXX format', () => {
  const id = generateBookingId(2026, () => 0.5);
  assert.match(id, /^BGM-2026-\d{4}$/);
  assert.equal(id, 'BGM-2026-5500');
});

test('validateTripForm rejects missing destinations or invalid email and accepts valid payload', () => {
  const invalid = validateTripForm({
    fullName: 'A',
    email: 'bad-email',
    phone: '123',
    preferredDate: '',
    duration: '1 Day',
    travelers: 0,
    budget: 'Standard',
    selectedDestinations: [],
    experiences: [],
    notes: '',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.preferredDate);
  assert.ok(invalid.errors.travelers);
  assert.ok(invalid.errors.selectedDestinations);

  const valid = validateTripForm({
    fullName: 'Ananya Kulkarni',
    email: 'ananya@example.com',
    phone: '+91 98450 12345',
    preferredDate: '2026-12-14',
    duration: '2 Days / 1 Night',
    travelers: 4,
    budget: 'Standard',
    selectedDestinations: ['Gokak Falls'],
    experiences: ['Local Food Trail'],
    notes: 'Prefer early morning falls visit',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('isSafeImageUrl blocks javascript: URIs and allows https, local assets, and image base64', () => {
  assert.equal(isSafeImageUrl('javascript:alert(1)'), false);
  assert.equal(isSafeImageUrl('/src/assets/images/../../secret'), false);
  assert.equal(isSafeImageUrl('https://example.com/photo.jpg'), true);
  assert.equal(isSafeImageUrl('/src/assets/images/hero.jpg'), true);
  assert.equal(isSafeImageUrl('data:image/png;base64,iVBORw0KGgo='), true);
});

test('validatePhotoPayload validates title, category, and imageUrl', () => {
  const bad = validatePhotoPayload({ title: '', category: 'Nature', imageUrl: 'ftp://bad' });
  assert.equal(bad.valid, false);

  const good = validatePhotoPayload({
    title: 'Monsoon Mist at Gokak',
    category: 'Nature',
    caption: 'View from the suspension bridge',
    imageUrl: 'https://example.com/gokak.jpg',
  });
  assert.equal(good.valid, true);
});

test('buildTripSummary computes exploration hours and recommended duration', () => {
  const summary = buildTripSummary(
    ['Gokak Falls', 'Belagavi Fort & Kamal Basti', 'Kittur Rani Channamma Fort & Palace'],
    SAMPLE_DESTINATIONS,
    ['Local Food Trail', 'Heritage & Fort Walk'],
    '1 Day'
  );
  assert.equal(summary.destinationCount, 3);
  assert.equal(summary.experienceCount, 2);
  assert.equal(summary.estimatedExplorationHours, 8.5);
  assert.equal(summary.recommendedDurationLabel, '2 Days / 1 Night');
});

test('validateReviewForm rejects short comments or invalid ratings and accepts valid review', () => {
  const invalid = validateReviewForm({
    visitorName: 'A',
    originCity: '',
    rating: 6,
    visitedLandmark: '',
    comment: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.visitorName);
  assert.ok(invalid.errors.originCity);
  assert.ok(invalid.errors.rating);
  assert.ok(invalid.errors.visitedLandmark);
  assert.ok(invalid.errors.comment);

  const valid = validateReviewForm({
    visitorName: 'Nikhil Patil',
    originCity: 'Belagavi, Karnataka',
    rating: 5,
    visitedLandmark: 'Gokak Falls',
    comment: 'Incredible views from the bridge during monsoon mornings.',
  });
  assert.equal(valid.valid, true);
});
