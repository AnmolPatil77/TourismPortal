import { useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';
import type { Destination, VisitorReview } from '../types';
import { dataService } from '../services/dataService';
import { validateReviewForm } from '../utils/tripHelpers';

interface ReviewsSectionProps {
  reviews: VisitorReview[];
  destinations: Destination[];
  onReviewCreated: (review: VisitorReview) => void;
}

export function ReviewsSection({
  reviews,
  destinations,
  onReviewCreated,
}: ReviewsSectionProps) {
  const [visitorName, setVisitorName] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [visitedLandmark, setVisitedLandmark] = useState(
    destinations[0]?.name ?? 'Gokak Falls'
  );
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNote, setSubmittedNote] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittedNote(null);

    const payload = {
      visitorName,
      originCity,
      rating,
      visitedLandmark,
      comment,
    };

    const validation = validateReviewForm(payload);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const result = await dataService.createReview(payload);
      if (result.errors || !result.review) {
        setErrors(result.errors ?? { comment: 'Unable to publish review.' });
        return;
      }
      onReviewCreated(result.review);
      setVisitorName('');
      setOriginCity('');
      setComment('');
      setRating(5);
      setSubmittedNote('Thank you! Your Belagavi field review has been published.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="scroll-mt-20 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200/80"
    >
      <div className="max-w-2xl mb-10">
        <p className="text-xs uppercase tracking-widest text-[#1B4332] font-semibold mb-2">
          04 · Traveler Stories
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
          Visitor Impressions &amp; Field Reviews
        </h2>
        <p className="mt-3 text-[#1F2937]/75 text-base leading-relaxed">
          Notes from travelers exploring Belagavi’s monsoon waterfalls, Ratta stone forts, and local kitchens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          data-testid="reviews-list"
          className="lg:col-span-7 grid grid-cols-1 gap-5"
        >
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-white rounded-[14px] border border-stone-200/85 p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-xs font-medium text-[#1B4332]/85">
                  <span>{rev.visitedLandmark}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{rev.originCity}</span>
                </p>
                <div
                  aria-label={`Rated ${rev.rating} out of 5 stars`}
                  className="flex items-center gap-0.5 text-[#D97706]"
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < rev.rating ? 'fill-[#D97706]' : 'text-stone-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#1F2937]/90 leading-relaxed mb-4">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <p className="font-serif text-sm font-semibold text-[#1F2937]">
                {rev.visitorName}
              </p>
            </article>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-5 bg-white rounded-[14px] border border-stone-200/90 p-6 shadow-sm space-y-4"
        >
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#1F2937]">
              Share Your Belagavi Review
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Visited recently? Leave a note for fellow travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="rev-name"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Your Name *
              </label>
              <input
                id="rev-name"
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="e.g. Rohan Desai"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
              />
              {errors.visitorName && (
                <p role="alert" className="text-xs text-red-700 mt-1">
                  {errors.visitorName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="rev-city"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Your City *
              </label>
              <input
                id="rev-city"
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="e.g. Hubballi, Karnataka"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
              />
              {errors.originCity && (
                <p role="alert" className="text-xs text-red-700 mt-1">
                  {errors.originCity}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="rev-landmark"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Landmark Visited
              </label>
              <select
                id="rev-landmark"
                value={visitedLandmark}
                onChange={(e) => setVisitedLandmark(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
              >
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.name}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="rev-rating"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Rating
              </label>
              <select
                id="rev-rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
              >
                <option value={5}>5 Stars — Exceptional</option>
                <option value={4}>4 Stars — Memorable</option>
                <option value={3}>3 Stars — Good</option>
                <option value={2}>2 Stars — Fair</option>
                <option value={1}>1 Star — Needs Work</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="rev-comment"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Your Experience *
            </label>
            <textarea
              id="rev-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share tips on timing, local sweets, or scenic viewpoints..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332]"
            />
            {errors.comment && (
              <p role="alert" className="text-xs text-red-700 mt-1">
                {errors.comment}
              </p>
            )}
          </div>

          {submittedNote && (
            <p
              role="status"
              className="text-xs text-[#1B4332] bg-[#1B4332]/10 border border-[#1B4332]/20 rounded-lg px-3 py-2"
            >
              {submittedNote}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#133124] disabled:opacity-60 text-[#FAF9F6] text-sm font-semibold transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Publishing Review...' : 'Publish Review'}
          </button>
        </form>
      </div>
    </section>
  );
}
