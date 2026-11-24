import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isAdminView: boolean;
  onToggleAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'destinations', label: 'Destinations' },
  { id: 'food-culture', label: 'Food & Culture' },
  { id: 'gallery', label: 'Photo Gallery' },
  { id: 'plan-trip', label: 'Plan Your Trip' },
];

export function Navbar({
  isAdminView,
  onToggleAdmin,
  onNavigateSection,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line editorial brand wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('top');
          }}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#1B4332] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
        >
          Belagavi
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1F2937]/80"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.id);
              }}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#1B4332] hover:border-[#1B4332] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onToggleAdmin();
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
              isAdminView
                ? 'bg-[#D97706] text-white hover:bg-[#B45309]'
                : 'bg-[#1B4332] text-[#FAF9F6] hover:bg-[#133124]'
            }`}
          >
            {isAdminView ? 'Back to Guide' : 'Admin Dashboard'}
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-[#1F2937] hover:bg-stone-200/70 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-stone-200 bg-[#FAF9F6] px-4 py-3 space-y-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.id);
              }}
              className="block py-2.5 px-3 text-sm font-medium text-[#1F2937] rounded-lg hover:bg-stone-200/60 hover:text-[#1B4332]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
