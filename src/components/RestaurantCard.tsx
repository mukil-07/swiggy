import React from 'react';
import { Star, Clock, MapPin, Heart, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Restaurant } from '../types';
import { useFoodora } from '../context/FoodoraContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  viewMode?: 'grid' | 'list';
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  viewMode = 'grid'
}) => {
  const { navigate, toggleFavoriteRestaurant, isRestaurantFavorite } = useFoodora();
  const isFav = isRestaurantFavorite(restaurant.id);

  const handleCardClick = () => {
    navigate('restaurant-detail', restaurant.id);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteRestaurant(restaurant.id);
  };

  if (viewMode === 'list') {
    return (
      <div
        id={`restaurant-card-${restaurant.id}`}
        onClick={handleCardClick}
        className="group relative bg-white dark:bg-[#121212] rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden hover:shadow-xl dark:hover:border-white/20 transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
      >
        <div className="relative sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-900">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {restaurant.offerBadge && (
            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#FF523B] to-[#FF8E3B] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{restaurant.offerBadge}</span>
            </div>
          )}
          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-sm border border-transparent dark:border-white/10 flex items-center justify-center shadow-md transition-transform active:scale-90 hover:scale-110"
            aria-label="Save restaurant"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFav ? 'fill-[#FF523B] text-[#FF523B]' : 'text-slate-600 dark:text-zinc-300'
              }`}
            />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#FF523B] transition-colors font-['Outfit']">
                    {restaurant.name}
                  </h3>
                  {restaurant.isVegOnly && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                      Pure Veg
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1">
                  {restaurant.cuisines.join(' • ')}
                </p>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs shrink-0">
                <span>{restaurant.rating}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-3 text-xs text-slate-600 dark:text-zinc-300 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF523B]" />
                {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} mins
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                {restaurant.distanceKm} km • {restaurant.area}
              </span>
              <span>${restaurant.priceForTwo} for two</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {restaurant.deliveryBadge || 'Express Delivery'}
            </span>
            <button className="flex items-center gap-1 text-xs font-bold text-[#FF523B] group-hover:translate-x-1 transition-transform">
              <span>View Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`restaurant-card-${restaurant.id}`}
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-[#121212] rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden hover:shadow-xl dark:hover:border-white/20 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient shadow overlay for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Favorite Heart Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-sm border border-transparent dark:border-white/10 flex items-center justify-center shadow-md transition-transform active:scale-90 hover:scale-110 z-10"
          aria-label="Save restaurant"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-[#FF523B] text-[#FF523B]' : 'text-slate-600 dark:text-zinc-300'
            }`}
          />
        </button>

        {/* Promoted Tag */}
        {restaurant.isPromoted && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-[#FF8E3B] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#FF8E3B]/30">
            Promoted
          </div>
        )}

        {/* Bottom image stats: Offer badge & delivery timing */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
          {restaurant.offerBadge ? (
            <div className="bg-gradient-to-r from-[#FF523B] to-[#FF8E3B] px-2.5 py-1 rounded-lg text-[11px] shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{restaurant.offerBadge}</span>
            </div>
          ) : (
            <div />
          )}

          <div className="bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-[#FF8E3B]" />
            <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax}m</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#FF523B] transition-colors font-['Outfit'] line-clamp-1">
              {restaurant.name}
            </h3>

            {/* Rating Pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-xs shrink-0">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1">
            {restaurant.cuisines.join(', ')}
          </p>
        </div>

        {/* Location & Pricing */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
          <span className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span className="truncate">{restaurant.area}</span>
          </span>
          <span className="font-semibold text-slate-700 dark:text-zinc-200 shrink-0">
            ${restaurant.priceForTwo} for two
          </span>
        </div>
      </div>
    </div>
  );
};
