import { useState } from 'react';
import { Calendar, Palette, Utensils } from 'lucide-react';
import type { ArtCraftItem, CulturalActivity, FoodItem } from '../types';
import { ResilientImage } from './ResilientImage';

interface FoodCultureSectionProps {
  food: FoodItem[];
  art: ArtCraftItem[];
  culture: CulturalActivity[];
}

type ShowcaseTab = 'food' | 'art' | 'culture';

const TABS: { id: ShowcaseTab; label: string }[] = [
  { id: 'food', label: 'Local Food & Culinary Heritage' },
  { id: 'art', label: 'Traditional Art & Handicrafts' },
  { id: 'culture', label: 'Cultural Activities & Festivals' },
];

export function FoodCultureSection({ food, art, culture }: FoodCultureSectionProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('food');

  return (
    <section
      id="food-culture"
      className="scroll-mt-20 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200/80"
    >
      <div className="max-w-3xl mb-8">
        <p className="text-xs uppercase tracking-widest text-[#1B4332] font-semibold mb-2">
          02 · Living Traditions
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
          Culinary Heritage, Artisans &amp; Folk Traditions
        </h2>
        <p className="mt-3 text-[#1F2937]/75 text-base leading-relaxed">
          Belagavi sits at a linguistic and culinary confluence—celebrated equally for slow-caramelized Kunda, hand-turned Gokak toys, and vibrant folk drum festivals.
        </p>
      </div>

      {/* Interactive 3-Tab Switcher */}
      <div
        role="tablist"
        aria-label="Belagavi Food, Art, and Cultural Traditions"
        className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/70 rounded-xl mb-10 w-fit max-w-full"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                isActive
                  ? 'bg-[#1B4332] text-[#FAF9F6] shadow-sm'
                  : 'text-[#1F2937]/80 hover:text-[#1B4332] hover:bg-white/60'
              }`}
            >
              {tab.id === 'food' && <Utensils className="w-4 h-4" aria-hidden="true" />}
              {tab.id === 'art' && <Palette className="w-4 h-4" aria-hidden="true" />}
              {tab.id === 'culture' && <Calendar className="w-4 h-4" aria-hidden="true" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'food' && (
        <div
          role="tabpanel"
          aria-label="Local Food and Culinary Heritage"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {food.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[14px] overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.name}
                  fallbackTitle={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-medium text-[#D97706] mb-1.5">
                  <span>{item.dietary}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{item.type}</span>
                </p>
                <h3 className="font-serif text-lg font-semibold text-[#1F2937] mb-1.5">
                  {item.name}
                </h3>
                <p className="text-xs text-stone-500 mb-3">{item.origin}</p>
                <p className="text-sm text-[#1F2937]/80 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'art' && (
        <div
          role="tabpanel"
          aria-label="Traditional Art and Handicrafts"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {art.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[14px] overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.name}
                  fallbackTitle={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-medium text-[#1B4332]/85 mb-1.5">
                  {item.craftType}
                </p>
                <h3 className="font-serif text-lg font-semibold text-[#1F2937] mb-1.5">
                  {item.name}
                </h3>
                <p className="text-xs text-stone-500 mb-3">{item.cluster}</p>
                <p className="text-sm text-[#1F2937]/80 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'culture' && (
        <div
          role="tabpanel"
          aria-label="Cultural Activities and Festivals"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {culture.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[14px] overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.name}
                  fallbackTitle={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-medium text-[#D97706] mb-1.5">
                  <span>{item.season}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{item.tradition}</span>
                </p>
                <h3 className="font-serif text-lg font-semibold text-[#1F2937] mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-[#1F2937]/80 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
