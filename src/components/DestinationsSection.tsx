import { useState } from 'react';
import { Check, MapPin, Plus } from 'lucide-react';
import type { Destination, DestinationFilter } from '../types';
import { filterDestinations } from '../utils/tripHelpers';
import { ResilientImage } from './ResilientImage';

interface DestinationsSectionProps {
  destinations: Destination[];
  selectedDestinations: string[];
  onToggleDestination: (name: string) => void;
}

const FILTER_TABS: DestinationFilter[] = [
  'All',
  'Forts & Heritage',
  'Waterfalls & Nature',
  'Spiritual & Landmarks',
];

export function DestinationsSection({
  destinations,
  selectedDestinations,
  onToggleDestination,
}: DestinationsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<DestinationFilter>('All');

  const filtered = filterDestinations(destinations, activeFilter);

  return (
    <section
      id="destinations"
      className="scroll-mt-20 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200/80"
    >
      <div className="flex flex-col items-start gap-6 mb-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-[#1B4332] font-semibold mb-2">
            01 · Curated Places
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
            Belagavi Landmarks, Forts &amp; Cascades
          </h2>
          <p className="mt-3 text-[#1F2937]/75 text-base leading-relaxed">
            From roaring horseshoe waterfalls along the Ghataprabha to hilltop stone
            citadels, select the landmarks you wish to include in your custom itinerary.
          </p>
        </div>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Belagavi destinations by category"
          className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-xl"
        >
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                  active
                    ? 'bg-[#1B4332] text-[#FAF9F6] shadow-sm'
                    : 'text-[#1F2937]/75 hover:text-[#1B4332] hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div
        data-testid="destinations-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {filtered.map((dest) => {
          const isSelected = selectedDestinations.includes(dest.name);
          return (
            <article
              key={dest.id}
              className="group bg-white rounded-[14px] overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <ResilientImage
                  src={dest.imageUrl}
                  alt={`${dest.name} in Belagavi`}
                  fallbackTitle={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Clean unboxed typographic metadata */}
                <p className="text-xs font-medium text-[#1B4332]/80 tracking-wide mb-2">
                  <span>{dest.category}</span>
                  {dest.secondaryCategory && (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>{dest.secondaryCategory}</span>
                    </>
                  )}
                </p>

                <h3 className="font-serif text-xl font-semibold text-[#1F2937] leading-snug mb-2">
                  {dest.name}
                </h3>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-600 mb-3 tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
                    {dest.distanceFromCity} from city
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Best season: {dest.bestSeason}</span>
                </div>

                <p className="text-sm text-[#1F2937]/80 leading-relaxed mb-5 flex-1">
                  {dest.description}
                </p>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500 tabular-nums">
                    ~{dest.estimatedHours} hrs visit
                  </span>

                  <button
                    type="button"
                    onClick={() => onToggleDestination(dest.name)}
                    aria-pressed={isSelected}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                      isSelected
                        ? 'bg-[#1B4332] text-[#FAF9F6] hover:bg-[#133124]'
                        : 'bg-[#D97706]/10 text-[#B45309] hover:bg-[#D97706] hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Added to Trip</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span>Add to Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
