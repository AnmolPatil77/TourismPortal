import { useState, type FormEvent } from 'react';
import { CalendarDays, CheckCircle2, Clock, MapPinned, Users, X } from 'lucide-react';
import type {
  BudgetRange,
  CreateTripPayload,
  Destination,
  ExperiencePreference,
  TripDuration,
  TripRequest,
} from '../types';
import {
  ALLOWED_BUDGETS,
  ALLOWED_DURATIONS,
  ALLOWED_EXPERIENCES,
  buildTripSummary,
  validateTripForm,
} from '../utils/tripHelpers';
import { dataService } from '../services/dataService';

interface TripPlannerSectionProps {
  destinations: Destination[];
  selectedDestinations: string[];
  onToggleDestination: (name: string) => void;
  onTripCreated: (trip: TripRequest) => void;
}

export function TripPlannerSection({
  destinations,
  selectedDestinations,
  onToggleDestination,
  onTripCreated,
}: TripPlannerSectionProps) {
  const [experiences, setExperiences] = useState<ExperiencePreference[]>([
    'Local Food Trail',
  ]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-12-15');
  const [duration, setDuration] = useState<TripDuration>('2 Days / 1 Night');
  const [travelers, setTravelers] = useState<number>(2);
  const [budget, setBudget] = useState<BudgetRange>('Standard');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedTrip, setConfirmedTrip] = useState<TripRequest | null>(null);

  const toggleExperience = (exp: ExperiencePreference) => {
    setExperiences((prev) =>
      prev.includes(exp) ? prev.filter((item) => item !== exp) : [...prev, exp]
    );
  };

  const summary = buildTripSummary(
    selectedDestinations,
    destinations,
    experiences,
    duration
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const payload: CreateTripPayload = {
      fullName,
      email,
      phone,
      preferredDate,
      duration,
      travelers: Number(travelers),
      budget,
      selectedDestinations,
      experiences,
      notes,
    };

    const validation = validateTripForm(payload);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await dataService.createTrip(payload);
      if (result.errors || !result.trip) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setServerError('Could not save your trip inquiry. Please try again.');
        }
        return;
      }

      onTripCreated(result.trip);
      setConfirmedTrip(result.trip);
      setFullName('');
      setEmail('');
      setPhone('');
      setNotes('');
    } catch {
      setServerError('Unexpected error while submitting trip request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="plan-trip"
      className="scroll-mt-20 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mb-10">
        <p className="text-xs uppercase tracking-widest text-[#1B4332] font-semibold mb-2">
          05 · Custom Itinerary Builder
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
          Plan Your Belagavi Journey
        </h2>
        <p className="mt-3 text-[#1F2937]/75 text-base leading-relaxed">
          Combine forts, waterfalls, and culinary trails into one itinerary. Destinations you add above sync automatically here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 bg-white rounded-[14px] border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-7"
        >
          {/* Destination Multi-Select */}
          <fieldset>
            <legend className="text-sm font-semibold text-[#1F2937] mb-1">
              1. Select Belagavi Destinations
            </legend>
            <p className="text-xs text-stone-500 mb-3">
              Pick one or more places you want to visit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destinations.map((dest) => {
                const checked = selectedDestinations.includes(dest.name);
                return (
                  <label
                    key={dest.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-sm transition-colors cursor-pointer ${
                      checked
                        ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332] font-medium'
                        : 'border-stone-200 hover:border-stone-300 text-[#1F2937]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleDestination(dest.name)}
                      className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-[#1B4332]"
                    />
                    <span className="leading-snug">{dest.name}</span>
                  </label>
                );
              })}
            </div>
            {errors.selectedDestinations && (
              <p role="alert" className="text-xs text-red-700 mt-2">
                {errors.selectedDestinations}
              </p>
            )}
          </fieldset>

          {/* Experience Preferences */}
          <fieldset>
            <legend className="text-sm font-semibold text-[#1F2937] mb-1">
              2. Experience Preferences
            </legend>
            <p className="text-xs text-stone-500 mb-3">
              Tailor local food tastings, walks, and artisan studio visits.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALLOWED_EXPERIENCES.map((exp) => {
                const checked = experiences.includes(exp);
                return (
                  <label
                    key={exp}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm transition-colors cursor-pointer ${
                      checked
                        ? 'border-[#D97706] bg-[#D97706]/8 text-[#9A3412] font-medium'
                        : 'border-stone-200 hover:border-stone-300 text-[#1F2937]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleExperience(exp)}
                      className="h-4 w-4 rounded border-stone-300 accent-[#D97706]"
                    />
                    <span>{exp}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Visitor Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#1F2937]">
              3. Visitor &amp; Schedule Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="trip-fullName"
                  className="block text-xs font-medium text-stone-700 mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="trip-fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Kulkarni"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                />
                {errors.fullName && (
                  <p role="alert" className="text-xs text-red-700 mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trip-email"
                  className="block text-xs font-medium text-stone-700 mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="trip-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-red-700 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trip-phone"
                  className="block text-xs font-medium text-stone-700 mb-1.5"
                >
                  Phone Number *
                </label>
                <input
                  id="trip-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                />
                {errors.phone && (
                  <p role="alert" className="text-xs text-red-700 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trip-date"
                  className="block text-xs font-medium text-stone-700 mb-1.5"
                >
                  Preferred Travel Date *
                </label>
                <input
                  id="trip-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                />
                {errors.preferredDate && (
                  <p role="alert" className="text-xs text-red-700 mt-1">
                    {errors.preferredDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trip-duration"
                  className="block text-xs font-medium text-stone-700 mb-1.5"
                >
                  Duration
                </label>
                <select
                  id="trip-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as TripDuration)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  {ALLOWED_DURATIONS.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="trip-travelers"
                  className="block text-xs font-medium text-stone-700 mb-1.5"
                >
                  Number of Travelers
                </label>
                <input
                  id="trip-travelers"
                  type="number"
                  min={1}
                  max={50}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 tabular-nums"
                />
                {errors.travelers && (
                  <p role="alert" className="text-xs text-red-700 mt-1">
                    {errors.travelers}
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-stone-700 mb-1.5">
                Budget Range
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {ALLOWED_BUDGETS.map((tier) => {
                  const active = budget === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setBudget(tier)}
                      aria-pressed={active}
                      className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1B4332] text-[#FAF9F6] border-[#1B4332]'
                          : 'bg-[#FAF9F6] text-[#1F2937] border-stone-300 hover:border-[#1B4332]'
                      }`}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="trip-notes"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Special Notes &amp; Interests
              </label>
              <textarea
                id="trip-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary preferences, senior-friendly pacing, artisan visits, or pickup location..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF9F6]/60 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:opacity-60 text-white font-semibold text-sm sm:text-base transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
          >
            {isSubmitting ? 'Submitting Trip Request...' : 'Submit Trip Request'}
          </button>
        </form>

        {/* Live Trip Summary Box */}
        <aside
          aria-label="Live Trip Summary"
          data-testid="live-trip-summary"
          className="lg:col-span-5 lg:sticky lg:top-24 bg-[#1B4332] text-[#FAF9F6] rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">
              Live Itinerary Summary
            </p>
            <h3 className="font-serif text-2xl font-semibold">
              Your Belagavi Route
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/15 text-sm">
            <div>
              <p className="text-xs text-stone-300 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                Selected Duration
              </p>
              <p className="font-semibold mt-1">{duration}</p>
            </div>
            <div>
              <p className="text-xs text-stone-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                Party &amp; Tier
              </p>
              <p className="font-semibold mt-1 tabular-nums">
                {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'} · {budget}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-300 flex items-center gap-1.5">
                <MapPinned className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                Landmarks
              </p>
              <p className="font-semibold mt-1 tabular-nums">
                {summary.destinationCount} Selected
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                Sightseeing Est.
              </p>
              <p className="font-semibold mt-1 tabular-nums">
                ~{summary.estimatedExplorationHours} hrs
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-300 mb-2.5">
              Destinations Included
            </h4>
            {summary.destinationNames.length === 0 ? (
              <p className="text-sm text-stone-300/80 italic">
                No destinations selected yet. Click &ldquo;Add to Trip&rdquo; on any landmark card or check places in the form.
              </p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {summary.destinationNames.map((name, idx) => (
                  <li key={name} className="flex items-center justify-between gap-2">
                    <span>
                      <span className="text-amber-300 tabular-nums mr-2">
                        0{idx + 1}.
                      </span>
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-300 mb-2">
              Chosen Experiences ({summary.experienceCount})
            </h4>
            {experiences.length === 0 ? (
              <p className="text-sm text-stone-300/80 italic">
                Optional: choose food trails or artisan visits.
              </p>
            ) : (
              <p className="text-sm text-stone-100 leading-relaxed">
                {experiences.join(' · ')}
              </p>
            )}
          </div>

          {summary.recommendedDurationLabel !== duration &&
            summary.destinationCount > 0 && (
              <p className="text-xs text-amber-200 bg-white/10 rounded-lg p-3 leading-relaxed">
                Tip: With {summary.destinationCount} landmarks selected, we recommend{' '}
                <strong>{summary.recommendedDurationLabel}</strong> for comfortable travel between Gokak, Kittur, and Khanapur.
              </p>
            )}
        </aside>
      </div>

      {/* Confirmation Modal */}
      {confirmedTrip && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Trip Request Confirmation"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmedTrip(null)}
        >
          <div
            className="bg-white rounded-[14px] max-w-lg w-full p-6 sm:p-8 shadow-xl border border-stone-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close confirmation modal"
              onClick={() => setConfirmedTrip(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-[#1F2937] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-[#1B4332] mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#1B4332]" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-[#D97706]">
                  Itinerary Received
                </p>
                <h3 className="font-serif text-2xl font-semibold text-[#1F2937]">
                  Belagavi Trip Request Saved
                </h3>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200 rounded-xl p-4 mb-5">
              <p className="text-xs uppercase tracking-wider text-stone-500">
                Booking Reference ID
              </p>
              <p
                data-testid="confirmation-booking-id"
                className="font-mono text-xl font-bold text-[#1B4332] mt-0.5 tabular-nums"
              >
                {confirmedTrip.bookingId}
              </p>
            </div>

            <dl className="space-y-2 text-sm text-[#1F2937]/85 mb-6">
              <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                <dt className="text-stone-500">Traveler</dt>
                <dd className="font-medium text-right">{confirmedTrip.fullName}</dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                <dt className="text-stone-500">Date &amp; Duration</dt>
                <dd className="font-medium text-right tabular-nums">
                  {confirmedTrip.preferredDate} · {confirmedTrip.duration}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                <dt className="text-stone-500">Destinations</dt>
                <dd className="font-medium text-right">
                  {confirmedTrip.selectedDestinations.join(', ')}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5">
                <dt className="text-stone-500">Current Status</dt>
                <dd className="font-semibold text-[#D97706]">{confirmedTrip.status}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setConfirmedTrip(null)}
              className="w-full py-3 px-5 rounded-xl bg-[#1B4332] hover:bg-[#133124] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
