import { useCallback, useEffect, useState } from 'react';
import type {
  GalleryPhoto,
  SiteContentResponse,
  TripRequest,
  TripStatus,
  VisitorReview,
} from './types';
import { dataService } from './services/dataService';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationsSection } from './components/DestinationsSection';
import { FoodCultureSection } from './components/FoodCultureSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { TripPlannerSection } from './components/TripPlannerSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  const [content, setContent] = useState<SiteContentResponse | null>(null);
  const [trips, setTrips] = useState<TripRequest[]>([]);
  const [reviews, setReviews] = useState<VisitorReview[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([
    'Gokak Falls',
  ]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setIsLoadingContent(true);
    setIsLoadingTrips(true);
    setLoadError(null);
    try {
      const [loadedContent, loadedTrips, loadedReviews] = await Promise.all([
        dataService.getContent(),
        dataService.listTrips(),
        dataService.listReviews(),
      ]);
      setContent(loadedContent);
      setTrips(loadedTrips);
      setReviews(loadedReviews);
    } catch {
      setLoadError('Unable to load Belagavi tourism data. Please refresh the page.');
    } finally {
      setIsLoadingContent(false);
      setIsLoadingTrips(false);
    }
  }, []);

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

  const handleToggleDestination = (name: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleNavigateSection = (sectionId: string) => {
    if (isAdminView) {
      setIsAdminView(false);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTripCreated = (trip: TripRequest) => {
    setTrips((prev) => [trip, ...prev]);
  };

  const handleUpdateTripStatus = async (id: string, status: TripStatus) => {
    const updated = await dataService.updateTripStatus(id, status);
    if (updated) {
      setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const handleDeleteTrip = async (id: string) => {
    const deleted = await dataService.deleteTrip(id);
    if (deleted) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAddPhoto = (photo: GalleryPhoto) => {
    setContent((prev) =>
      prev ? { ...prev, gallery: [photo, ...prev.gallery] } : prev
    );
  };

  const handleDeletePhoto = async (id: string) => {
    const deleted = await dataService.deleteGalleryPhoto(id);
    if (deleted) {
      setContent((prev) =>
        prev
          ? { ...prev, gallery: prev.gallery.filter((item) => item.id !== id) }
          : prev
      );
    }
  };

  const handleReviewCreated = (review: VisitorReview) => {
    setReviews((prev) => [review, ...prev]);
  };

  const handleDeleteReview = async (id: string) => {
    const deleted = await dataService.deleteReview(id);
    if (deleted) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1F2937]">
      <Navbar
        isAdminView={isAdminView}
        onToggleAdmin={() => {
          setIsAdminView((prev) => !prev);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateSection={handleNavigateSection}
      />

      {isAdminView ? (
        <AdminDashboard
          trips={trips}
          gallery={content?.gallery ?? []}
          reviews={reviews}
          isLoadingTrips={isLoadingTrips}
          onUpdateTripStatus={handleUpdateTripStatus}
          onDeleteTrip={handleDeleteTrip}
          onAddPhoto={handleAddPhoto}
          onDeletePhoto={handleDeletePhoto}
          onDeleteReview={handleDeleteReview}
          onCloseAdmin={() => setIsAdminView(false)}
        />
      ) : (
        <main className="flex-1">
          <HeroSection
            onExplore={() => handleNavigateSection('destinations')}
            onPlanTrip={() => handleNavigateSection('plan-trip')}
          />

          {isLoadingContent ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-stone-600">
              Loading Belagavi destinations, traditions, and gallery...
            </div>
          ) : loadError || !content ? (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
              <p className="text-red-700 font-medium mb-4">
                {loadError || 'Unable to load content.'}
              </p>
              <button
                type="button"
                onClick={() => void loadAllData()}
                className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-sm font-semibold cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <DestinationsSection
                destinations={content.destinations}
                selectedDestinations={selectedDestinations}
                onToggleDestination={handleToggleDestination}
              />

              <FoodCultureSection
                food={content.food}
                art={content.art}
                culture={content.culture}
              />

              <GallerySection photos={content.gallery} />

              <ReviewsSection
                reviews={reviews}
                destinations={content.destinations}
                onReviewCreated={handleReviewCreated}
              />

              <TripPlannerSection
                destinations={content.destinations}
                selectedDestinations={selectedDestinations}
                onToggleDestination={handleToggleDestination}
                onTripCreated={handleTripCreated}
              />
            </>
          )}
        </main>
      )}

      <Footer onNavigateSection={handleNavigateSection} />
    </div>
  );
}
