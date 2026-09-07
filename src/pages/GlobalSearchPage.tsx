import React, { useState } from 'react';
import { Search, X, TrendingUp, Sparkles, UtensilsCrossed, Store } from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodCard } from '../components/FoodCard';

export const GlobalSearchPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    restaurants,
    foodItems,
    navigate
  } = useFoodora();

  const [activeTab, setActiveTab] = useState<'all' | 'dishes' | 'restaurants'>('all');

  const popularSearches = [
    'Truffle Pizza',
    'Dum Biryani',
    'Salmon Sushi',
    'Burgers',
    'Matcha Cheesecake',
    'Crispy Tacos',
    'Açaí Bowl',
    'Pad Thai'
  ];

  const q = searchQuery.trim().toLowerCase();

  const matchingRestaurants = q
    ? restaurants.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.cuisines.some(c => c.toLowerCase().includes(q)) ||
          r.area.toLowerCase().includes(q)
      )
    : [];

  const matchingDishes = q
    ? foodItems.filter(
        f =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      )
    : [];

  return (
    <div id="global-search-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Big Search Input Field */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <input
            id="main-search-input"
            type="text"
            autoFocus
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for restaurants, dishes, cuisines, or neighborhoods..."
            className="w-full pl-14 pr-12 py-4 rounded-3xl bg-white dark:bg-slate-800 text-base text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
          />
          <Search className="w-6 h-6 text-orange-500 absolute left-5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular Trending Tags */}
        {!searchQuery && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-['Outfit']">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span>Popular Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item)}
                  className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results view */}
      {searchQuery && (
        <div className="space-y-8">
          {/* Results switcher tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All Results ({matchingDishes.length + matchingRestaurants.length})
              </button>
              <button
                onClick={() => setActiveTab('dishes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'dishes'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Dishes ({matchingDishes.length})
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'restaurants'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Restaurants ({matchingRestaurants.length})
              </button>
            </div>
          </div>

          {/* If no matches found */}
          {matchingDishes.length === 0 && matchingRestaurants.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No matching dishes or restaurants for "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Try checking for typos or searching for broader categories like "Burger", "Italian", or "Sushi".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Matching Restaurants Section */}
          {(activeTab === 'all' || activeTab === 'restaurants') &&
            matchingRestaurants.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Store className="w-4 h-4 text-orange-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                    Restaurants ({matchingRestaurants.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingRestaurants.map(r => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              </div>
            )}

          {/* Matching Dishes Section */}
          {(activeTab === 'all' || activeTab === 'dishes') &&
            matchingDishes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                    Dishes ({matchingDishes.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingDishes.map(d => (
                    <FoodCard key={d.id} food={d} />
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
