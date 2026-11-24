interface FooterProps {
  onNavigateSection: (id: string) => void;
}

export function Footer({ onNavigateSection }: FooterProps) {
  return (
    <footer className="bg-[#1B4332] text-[#FAF9F6] border-t border-[#133124]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-md">
          <p className="font-serif text-2xl font-semibold tracking-tight">
            Belagavi Travel Chronicles
          </p>
          <p className="text-sm text-stone-300 mt-2 leading-relaxed">
            Celebrating the Western Ghats, Ratta dynasty forts, culinary traditions, and artisan guilds of Belagavi (Belgaum), Karnataka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-stone-200">
          <a
            href="#destinations"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('destinations');
            }}
            className="hover:text-amber-300 transition-colors"
          >
            Destinations
          </a>
          <a
            href="#food-culture"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('food-culture');
            }}
            className="hover:text-amber-300 transition-colors"
          >
            Food &amp; Culture
          </a>
          <a
            href="#gallery"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('gallery');
            }}
            className="hover:text-amber-300 transition-colors"
          >
            Photo Gallery
          </a>
          <a
            href="#plan-trip"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('plan-trip');
            }}
            className="hover:text-amber-300 transition-colors"
          >
            Plan Your Trip
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-stone-300/80">
        © {new Date().getFullYear()} Belagavi Travel Chronicles · Karnataka Tourism Editorial Guide
      </div>
    </footer>
  );
}
