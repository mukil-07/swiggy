import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Star,
  Clock,
  Sparkles,
  X,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { CUISINES_LIST } from '../data/mockData';

export const RestaurantDiscoveryPage: React.FC = () => {
  const { restaurants } = useFoodora();

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60);
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [hasOffersOnly, setHasOffersOnly] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [priceTier, setPriceTier] = useState<string>('all'); // all | budget (<$30) | mid ($30-$50) | fine (>$50)
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter count calculation
  const activeFiltersCount = [
    selectedCuisine !== 'all',
    minRating > 0,
    maxDeliveryTime < 60,
    isVegOnly,
    hasOffersOnly,
    maxDistance < 10,
    priceTier !== 'all',
    searchTerm.trim() !== ''
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('all');
    setMinRating(0);
    setMaxDeliveryTime(60);
    setIsVegOnly(false);
    setHasOffersOnly(false);
    setMaxDistance(10);
    setPriceTier('all');
    setSortBy('relevance');
  };

  // Filtered and sorted restaurants
  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.cuisines.some(c => c.toLowerCase().includes(q)) ||
          r.area.toLowerCase().includes(q)
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'all') {
      result = result.filter(r =>
        r.cuisines.some(c => c.toLowerCase() === selectedCuisine.toLowerCase())
      );
    }

    // Min rating
    if (minRating > 0) {
      result = result.filter(r => r.rating >= minRating);
    }

    // Max delivery time
    if (maxDeliveryTime < 60) {
      result = result.filter(r => r.deliveryTimeMax <= maxDeliveryTime);
    }

    // Pure veg
    if (isVegOnly) {
      result = result.filter(r => r.isVegOnly);
    }

    // Has offers
    if (hasOffersOnly) {
      result = result.filter(r => Boolean(r.offerBadge));
    }

    // Max distance
    if (maxDistance < 10) {
      result = result.filter(r => r.distanceKm <= maxDistance);
    }

    // Price tier
    if (priceTier === 'budget') {
      result = result.filter(r => r.priceForTwo < 30);
    } else if (priceTier === 'mid') {
      result = result.filter(r => r.priceForTwo >= 30 && r.priceForTwo <= 50);
    } else if (priceTier === 'fine') {
      result = result.filter(r => r.priceForTwo > 50);
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery_time':
        result.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
        break;
      case 'distance':
        result.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case 'cost_asc':
        result.sort((a, b) => a.priceForTwo - b.priceForTwo);
        break;
      case 'cost_desc':
        result.sort((a, b) => b.priceForTwo - a.priceForTwo);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Relevance: Promoted first then highest rating
        result.sort((a, b) => {
          if (a.isPromoted && !b.isPromoted) return -1;
          if (!a.isPromoted && b.isPromoted) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return result;
  }, [
    restaurants,
    searchTerm,
    selectedCuisine,
    minRating,
    maxDeliveryTime,
    isVegOnly,
    hasOffersOnly,
    maxDistance,
    priceTier,
    sortBy
  ]);

  return (
    <div id="restaurant-discovery-page" className="min-h-screen pb-20">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-[#0A0A0A] border-b border-slate-200/80 dark:border-white/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
              Explore Kitchens & Cafes
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Showing {filteredRestaurants.length} restaurants matching your culinary criteria
            </p>
          </div>

          {/* Search within discovery */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter by name, cuisine, area..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-[#121212] text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-slate-200 dark:border-white/10 focus:border-[#FF523B] focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 bg-white dark:bg-[#121212] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6 hidden lg:block sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-['Outfit']">
                <SlidersHorizontal className="w-4 h-4 text-[#FF523B]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#FF523B] text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#FF523B] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Quick Toggle Pills */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Pure Veg Only</span>
                </div>
                <input
                  type="checkbox"
                  checked={isVegOnly}
                  onChange={e => setIsVegOnly(e.target.checked)}
                  className="rounded text-[#FF523B] focus:ring-[#FF523B]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF8E3B]" />
                  <span>With Special Offers</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasOffersOnly}
                  onChange={e => setHasOffersOnly(e.target.checked)}
                  className="rounded text-[#FF523B] focus:ring-[#FF523B]"
                />
              </label>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2 font-['Outfit']">
                Customer Rating
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 4.0, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      minRating === r
                        ? 'bg-[#FF523B] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-transparent dark:border-white/5'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Delivery Time */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-['Outfit']">
                  Max Delivery Time
                </span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  {maxDeliveryTime >= 60 ? 'Any' : `< ${maxDeliveryTime} mins`}
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={60}
                step={5}
                value={maxDeliveryTime}
                onChange={e => setMaxDeliveryTime(Number(e.target.value))}
                className="w-full accent-[#FF523B] cursor-pointer"
              />
            </div>

            {/* Max Distance */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-['Outfit']">
                  Max Distance
                </span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  {maxDistance >= 10 ? 'Any' : `< ${maxDistance} km`}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                step={1}
                value={maxDistance}
                onChange={e => setMaxDistance(Number(e.target.value))}
                className="w-full accent-[#FF523B] cursor-pointer"
              />
            </div>

            {/* Price Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2 font-['Outfit']">
                Cost For Two
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'budget', label: '< $30' },
                  { id: 'mid', label: '$30-$50' },
                  { id: 'fine', label: '$50+' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPriceTier(p.id)}
                    className={`py-2 px-1 rounded-xl font-bold transition-all ${
                      priceTier === p.id
                        ? 'bg-[#FF523B] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-transparent dark:border-white/5'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisines Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2 font-['Outfit']">
                Cuisine Type
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs">
                <button
                  onClick={() => setSelectedCuisine('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedCuisine === 'all'
                      ? 'bg-orange-50 dark:bg-[#FF523B]/10 text-[#FF523B] dark:text-[#FF8E3B] font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  All Cuisines
                </button>
                {CUISINES_LIST.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCuisine(c.name)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                      selectedCuisine.toLowerCase() === c.name.toLowerCase()
                        ? 'bg-orange-50 dark:bg-[#FF523B]/10 text-[#FF523B] dark:text-[#FF8E3B] font-bold'
                        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-base">{c.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Results Column */}
          <div className="flex-1 w-full space-y-5">
            {/* Sorting and View Mode Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#121212] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-[#FF523B]/10 text-[#FF523B] dark:text-[#FF8E3B] text-xs font-bold border border-orange-200 dark:border-[#FF523B]/20"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
              </button>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 dark:text-zinc-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-slate-100 dark:bg-[#1A1A1A] text-slate-800 dark:text-zinc-200 rounded-xl px-3 py-1.5 font-semibold border border-slate-200 dark:border-white/10 focus:border-[#FF523B] cursor-pointer outline-none"
                >
                  <option value="relevance">Relevance & Popularity</option>
                  <option value="rating">Rating: High to Low</option>
                  <option value="delivery_time">Delivery: Fastest First</option>
                  <option value="distance">Distance: Nearest First</option>
                  <option value="cost_asc">Cost: Low to High</option>
                  <option value="cost_desc">Cost: High to Low</option>
                  <option value="popular">Review Count</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#121212] text-[#FF523B] shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200'
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-[#121212] text-[#FF523B] shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Filters Drawer */}
            {isMobileFilterOpen && (
              <div className="lg:hidden p-4 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Active Filters</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-[#FF523B] font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setIsVegOnly(!isVegOnly)}
                    className={`p-2 rounded-xl border cursor-pointer ${isVegOnly ? 'bg-emerald-500 text-white' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300'}`}
                  >
                    Pure Veg
                  </button>
                  <button
                    onClick={() => setHasOffersOnly(!hasOffersOnly)}
                    className={`p-2 rounded-xl border cursor-pointer ${hasOffersOnly ? 'bg-[#FF523B] text-white' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300'}`}
                  >
                    Special Offers
                  </button>
                </div>
              </div>
            )}

            {/* Restaurant Results */}
            {filteredRestaurants.length === 0 ? (
              <div className="bg-white dark:bg-[#121212] rounded-3xl p-12 text-center border border-slate-200 dark:border-white/10">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-[#FF523B]/10 text-[#FF523B] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                  No kitchens match your exact filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-6">
                  Try clearing some filter criteria, broadening your delivery distance, or searching for other cuisines.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map(rest => (
                  <RestaurantCard key={rest.id} restaurant={rest} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRestaurants.map(rest => (
                  <RestaurantCard key={rest.id} restaurant={rest} viewMode="list" />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
