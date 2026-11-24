import { ArrowRight, Compass } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onExplore: () => void;
  onPlanTrip: () => void;
}

export function HeroSection({ onExplore, onPlanTrip }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-end overflow-hidden bg-[#1B4332]"
    >
      <ResilientImage
        src="/src/assets/images/hero_belagavi_falls_1795511399950.jpg"
        alt="Gokak sandstone waterfall and Western Ghats fort landscape in Belagavi"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fallbackTitle="Belagavi — Western Ghats & Heritage"
      />

      {/* Measured contrast scrim for WCAG AA legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm tracking-widest uppercase text-amber-300/95 font-medium mb-4">
            Belagavi, Karnataka · Western Ghats &amp; Deccan Frontier
          </p>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-semibold text-white leading-[1.12] tracking-tight text-balance mb-5">
            Discover Belagavi: Land of Waterfalls, Forts &amp; Timeless Culture
          </h1>

          <p className="text-base sm:text-lg text-stone-100/90 leading-relaxed max-w-2xl mb-8">
            Explore the cultural crossroads of Karnataka, Maharashtra, and Goa—from
            12th-century Ratta dynasty forts to iconic Kunda and Gokak Falls.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm sm:text-base transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <span>Explore Belagavi</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onPlanTrip}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Plan Your Trip</span>
            </button>
          </div>
        </div>

        {/* Quiet editorial strip below hero headline */}
        <div className="mt-10 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-white/90">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-300">Heritage Era</p>
            <p className="font-serif text-lg sm:text-xl font-medium mt-0.5 tabular-nums">
              1204 CE Ratta Dynasty
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-300">Gokak Cascade</p>
            <p className="font-serif text-lg sm:text-xl font-medium mt-0.5 tabular-nums">
              170 ft Sandstone Drop
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-300">Elevation</p>
            <p className="font-serif text-lg sm:text-xl font-medium mt-0.5 tabular-nums">
              762 m Western Ghats
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-300">Peak Season</p>
            <p className="font-serif text-lg sm:text-xl font-medium mt-0.5">
              Jul – Feb Monsoon &amp; Winter
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
