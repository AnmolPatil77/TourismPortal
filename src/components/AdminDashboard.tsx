import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowLeft, ImagePlus, Trash2, Upload } from 'lucide-react';
import type {
  GalleryCategory,
  GalleryPhoto,
  TripRequest,
  TripStatus,
  VisitorReview,
} from '../types';
import {
  ALLOWED_GALLERY_CATEGORIES,
  ALLOWED_STATUSES,
  validatePhotoPayload,
} from '../utils/tripHelpers';
import { dataService } from '../services/dataService';
import { ResilientImage } from './ResilientImage';

interface AdminDashboardProps {
  trips: TripRequest[];
  gallery: GalleryPhoto[];
  reviews: VisitorReview[];
  isLoadingTrips: boolean;
  onUpdateTripStatus: (id: string, status: TripStatus) => Promise<void>;
  onDeleteTrip: (id: string) => Promise<void>;
  onAddPhoto: (photo: GalleryPhoto) => void;
  onDeletePhoto: (id: string) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
  onCloseAdmin: () => void;
}

export function AdminDashboard({
  trips,
  gallery,
  reviews,
  isLoadingTrips,
  onUpdateTripStatus,
  onDeleteTrip,
  onAddPhoto,
  onDeletePhoto,
  onDeleteReview,
  onCloseAdmin,
}: AdminDashboardProps) {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<GalleryCategory>('Nature');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [updatingTripId, setUpdatingTripId] = useState<string | null>(null);

  const pendingCount = trips.filter((t) => t.status === 'Pending').length;
  const confirmedCount = trips.filter((t) => t.status === 'Confirmed').length;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    setPhotoSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose a valid image file (PNG, JPG, WebP, or GIF).');
      return;
    }

    if (file.size > 4.5 * 1024 * 1024) {
      setPhotoError('Selected image exceeds 4.5 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPhotoError(null);
    setPhotoSuccess(null);

    const payload = {
      title: photoTitle,
      category: photoCategory,
      caption: photoCaption,
      imageUrl: photoUrl,
    };

    const validation = validatePhotoPayload(payload);
    if (!validation.valid) {
      const firstErr = Object.values(validation.errors)[0];
      setPhotoError(firstErr || 'Please check the photo form fields.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await dataService.addGalleryPhoto(payload);
      if (result.errors || !result.photo) {
        const firstErr = result.errors
          ? Object.values(result.errors)[0]
          : 'Could not save photo.';
        setPhotoError(firstErr);
        return;
      }
      onAddPhoto(result.photo);
      setPhotoTitle('');
      setPhotoCaption('');
      setPhotoUrl('');
      setPhotoSuccess(`Added "${result.photo.title}" to the gallery.`);
    } catch {
      setPhotoError('Unexpected error while saving photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusChange = async (id: string, nextStatus: TripStatus) => {
    setUpdatingTripId(id);
    try {
      await onUpdateTripStatus(id, nextStatus);
    } finally {
      setUpdatingTripId(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#1B4332] font-semibold mb-1">
            Tourism Coordinator Console
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1B4332]">
            Belagavi Admin Dashboard
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage visitor trip inquiries, update itinerary statuses, and curate gallery survey photography.
          </p>
        </div>

        <button
          type="button"
          onClick={onCloseAdmin}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-sm font-medium text-[#1F2937] transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Visitor Guide</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[14px] border border-stone-200/90 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Total Trip Requests
          </p>
          <p className="font-serif text-3xl font-semibold text-[#1B4332] mt-1 tabular-nums">
            {trips.length}
          </p>
        </div>
        <div className="bg-white rounded-[14px] border border-stone-200/90 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Pending Review
          </p>
          <p className="font-serif text-3xl font-semibold text-[#D97706] mt-1 tabular-nums">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white rounded-[14px] border border-stone-200/90 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Confirmed Itineraries
          </p>
          <p className="font-serif text-3xl font-semibold text-[#1B4332] mt-1 tabular-nums">
            {confirmedCount}
          </p>
        </div>
        <div className="bg-white rounded-[14px] border border-stone-200/90 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Gallery Photos
          </p>
          <p className="font-serif text-3xl font-semibold text-[#1F2937] mt-1 tabular-nums">
            {gallery.length}
          </p>
        </div>
      </div>

      {/* Trip Requests Section */}
      <section aria-labelledby="admin-trips-heading" className="space-y-4">
        <h2
          id="admin-trips-heading"
          className="font-serif text-2xl font-semibold text-[#1F2937]"
        >
          Submitted Trip Requests
        </h2>

        {isLoadingTrips ? (
          <div className="bg-white rounded-[14px] border border-stone-200 p-8 text-center text-sm text-stone-500">
            Loading trip requests...
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-stone-200 p-8 text-center text-sm text-stone-600">
            No trip requests stored yet. Submit an inquiry in the Trip Planner to see it here.
          </div>
        ) : (
          <div className="bg-white rounded-[14px] border border-stone-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF9F6] text-xs uppercase tracking-wider text-stone-600">
                    <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                    <th className="py-3.5 px-4 font-semibold">Traveler</th>
                    <th className="py-3.5 px-4 font-semibold">Schedule</th>
                    <th className="py-3.5 px-4 font-semibold">Destinations &amp; Notes</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="align-top hover:bg-stone-50/70">
                      <td className="py-4 px-4 font-mono text-xs font-semibold text-[#1B4332] whitespace-nowrap tabular-nums">
                        {trip.bookingId}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[#1F2937]">{trip.fullName}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{trip.email}</p>
                        <p className="text-xs text-stone-500 tabular-nums">{trip.phone}</p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap tabular-nums">
                        <p className="font-medium text-[#1F2937]">{trip.preferredDate}</p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {trip.duration} · {trip.travelers}{' '}
                          {trip.travelers === 1 ? 'guest' : 'guests'}
                        </p>
                        <p className="text-xs text-stone-500">{trip.budget} tier</p>
                      </td>
                      <td className="py-4 px-4 max-w-sm">
                        <p className="font-medium text-[#1F2937] leading-snug">
                          {trip.selectedDestinations.join(', ')}
                        </p>
                        {trip.experiences.length > 0 && (
                          <p className="text-xs text-[#1B4332] mt-1">
                            {trip.experiences.join(' · ')}
                          </p>
                        )}
                        {trip.notes && (
                          <p className="text-xs text-stone-500 mt-1 italic">
                            &ldquo;{trip.notes}&rdquo;
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <label
                          htmlFor={`status-${trip.id}`}
                          className="sr-only"
                        >
                          Status for {trip.bookingId}
                        </label>
                        <select
                          id={`status-${trip.id}`}
                          value={trip.status}
                          disabled={updatingTripId === trip.id}
                          onChange={(e) =>
                            handleStatusChange(trip.id, e.target.value as TripStatus)
                          }
                          className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 ${
                            trip.status === 'Confirmed'
                              ? 'bg-[#1B4332]/10 border-[#1B4332]/30 text-[#1B4332]'
                              : trip.status === 'Completed'
                              ? 'bg-stone-100 border-stone-300 text-stone-700'
                              : 'bg-amber-50 border-amber-300 text-[#B45309]'
                          }`}
                        >
                          {ALLOWED_STATUSES.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onDeleteTrip(trip.id)}
                          aria-label={`Delete trip ${trip.bookingId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Gallery Upload & Manager Section */}
      <section
        aria-labelledby="admin-gallery-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Upload / Add Custom Photo Form */}
        <form
          onSubmit={handlePhotoSubmit}
          noValidate
          className="lg:col-span-5 bg-white rounded-[14px] border border-stone-200/90 shadow-sm p-6 space-y-5"
        >
          <div>
            <h2
              id="admin-gallery-heading"
              className="font-serif text-xl font-semibold text-[#1F2937] flex items-center gap-2"
            >
              <ImagePlus className="w-5 h-5 text-[#1B4332]" aria-hidden="true" />
              <span>Upload / Add Custom Photo</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Add survey or visitor photographs via direct file upload or image URL.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setUploadMode('url');
                setPhotoError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                uploadMode === 'url'
                  ? 'bg-white text-[#1B4332] shadow-sm'
                  : 'text-stone-600 hover:text-[#1F2937]'
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => {
                setUploadMode('file');
                setPhotoError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                uploadMode === 'file'
                  ? 'bg-white text-[#1B4332] shadow-sm'
                  : 'text-stone-600 hover:text-[#1F2937]'
              }`}
            >
              Upload Image File
            </button>
          </div>

          <div>
            <label
              htmlFor="photo-title"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Photo Title *
            </label>
            <input
              id="photo-title"
              type="text"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              placeholder="e.g. Golden Hour at Kamal Basadi"
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
            />
          </div>

          <div>
            <label
              htmlFor="photo-category"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Category
            </label>
            <select
              id="photo-category"
              value={photoCategory}
              onChange={(e) => setPhotoCategory(e.target.value as GalleryCategory)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
            >
              {ALLOWED_GALLERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {uploadMode === 'url' ? (
            <div>
              <label
                htmlFor="photo-url"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Image URL *
              </label>
              <input
                id="photo-url"
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://... or /src/assets/images/..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="photo-file"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Choose Local Image File *
              </label>
              <label
                htmlFor="photo-file"
                className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-xl p-4 bg-[#FAF9F6] hover:border-[#1B4332] cursor-pointer text-center"
              >
                <Upload className="w-5 h-5 text-[#1B4332] mb-1.5" aria-hidden="true" />
                <span className="text-xs font-medium text-[#1F2937]">
                  Click to pick PNG, JPG, or WebP (max 4.5 MB)
                </span>
                <input
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
          )}

          {photoUrl && (
            <div className="rounded-lg overflow-hidden border border-stone-200 aspect-[4/3] bg-stone-100">
              <ResilientImage
                src={photoUrl}
                alt={photoTitle || 'Uploaded preview'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="photo-caption"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Editorial Caption
            </label>
            <input
              id="photo-caption"
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="Short location note or architectural detail..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
            />
          </div>

          {photoError && (
            <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {photoError}
            </p>
          )}

          {photoSuccess && (
            <p role="status" className="text-xs text-[#1B4332] bg-[#1B4332]/10 border border-[#1B4332]/20 rounded-lg px-3 py-2">
              {photoSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {isUploading ? 'Saving to Gallery...' : 'Add Photo to Gallery'}
          </button>
        </form>

        {/* Gallery Inventory */}
        <div className="lg:col-span-7 bg-white rounded-[14px] border border-stone-200/90 shadow-sm p-6">
          <h3 className="font-serif text-xl font-semibold text-[#1F2937] mb-4">
            Published Gallery Frames ({gallery.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                className="flex gap-3 p-3 rounded-xl border border-stone-200 bg-[#FAF9F6]/50"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                  <ResilientImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#1B4332]">
                      {photo.category}
                      {photo.isCustom ? ' · Custom' : ''}
                    </p>
                    <p className="font-serif text-sm font-semibold text-[#1F2937] truncate">
                      {photo.title}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDeletePhoto(photo.id)}
                      aria-label={`Remove photo ${photo.title}`}
                      className="text-xs text-red-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visitor Reviews Moderation */}
      <section aria-labelledby="admin-reviews-heading" className="space-y-4">
        <h2
          id="admin-reviews-heading"
          className="font-serif text-2xl font-semibold text-[#1F2937]"
        >
          Visitor Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-stone-200 p-8 text-center text-sm text-stone-600">
            No visitor reviews published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-[14px] border border-stone-200/90 p-5 shadow-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-medium text-[#1B4332]">
                    {rev.visitedLandmark} · {rev.rating}/5 Stars
                  </p>
                  <p className="font-serif text-base font-semibold text-[#1F2937] mt-1">
                    {rev.visitorName}
                  </p>
                  <p className="text-xs text-stone-500 mb-2">{rev.originCity}</p>
                  <p className="text-sm text-[#1F2937]/85 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                <div className="flex justify-end pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => onDeleteReview(rev.id)}
                    aria-label={`Delete review by ${rev.visitorName}`}
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
