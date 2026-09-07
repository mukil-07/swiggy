import React, { useState, useMemo } from 'react';
import {
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Heart,
  Share2,
  Calendar,
  Sparkles,
  Phone,
  Search,
  Percent,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Info,
  ChevronRight,
  Wifi,
  Car,
  Wind
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { FoodCard } from '../components/FoodCard';
import { FoodItem } from '../types';

export const RestaurantDetailPage: React.FC = () => {
  const {
    selectedRestaurant,
    foodItems,
    cart,
    cartSubtotal,
    cartTotalCount,
    navigate,
    toggleFavoriteRestaurant,
    isRestaurantFavorite,
    openReservationModal,
    applyCoupon,
    showToast
  } = useFoodora();

  const restaurant = selectedRestaurant;
  const isFav = restaurant ? isRestaurantFavorite(restaurant.id) : false;

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [menuSearch, setMenuSearch] = useState<string>('');

  // Restaurant dishes
  const restaurantDishes = useMemo(() => {
    if (!restaurant) return [];
    return foodItems.filter(f => f.restaurantId === restaurant.id);
  }, [restaurant, foodItems]);

  // Categories present in this restaurant's menu
  const menuCategories = useMemo(() => {
    const cats = Array.from(new Set(restaurantDishes.map(d => d.category)));
    return ['all', ...cats];
  }, [restaurantDishes]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    let result = [...restaurantDishes];
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category === selectedCategory);
    }
    if (isVegOnly) {
      result = result.filter(d => d.isVeg);
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      result = result.filter(
        d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [restaurantDishes, selectedCategory, isVegOnly, menuSearch]);

  if (!restaurant) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Restaurant not found</h2>
        <button
          onClick={() => navigate('restaurants')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs"
        >
          Back to Kitchens
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'Share with your foodie friends!', 'success');
    }
  };

  return (
    <div id="restaurant-detail-page" className="min-h-screen pb-32">
      {/* Hero Banner Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-slate-900 overflow-hidden">
        <img
          src={restaurant.bannerImage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

        {/* Back and Action Buttons */}
        <div className="absolute top-4 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between z-10">
          <button
            onClick={() => navigate('restaurants')}
            className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all cursor-pointer"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant.id)}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all cursor-pointer"
              aria-label="Favorite"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFav ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Floating Restaurant Identity Details */}
        <div className="absolute bottom-6 left-4 right-4 max-w-7xl mx-auto z-10 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF523B] text-white">
                Verified Kitchen
              </span>
              {restaurant.isVegOnly && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                  100% Pure Veg
                </span>
              )}
              <span className="text-xs text-slate-300">
                {restaurant.cuisines.join(' • ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-['Outfit']">
              {restaurant.name}
            </h1>

            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              {restaurant.address} • {restaurant.area}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                <span>{restaurant.rating}</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-slate-300">
                ({restaurant.reviewCount} customer reviews)
              </span>
              <span className="text-slate-400">|</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Clock className="w-3.5 h-3.5 text-[#FF8E3B]" />
                {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} mins
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-200">${restaurant.priceForTwo} for two</span>
            </div>
          </div>

          {/* Book Table Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openReservationModal(restaurant)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF523B] to-[#FF8E3B] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#FF523B]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Available Restaurant Promos Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div
            onClick={() => applyCoupon('WELCOME50')}
            className="p-3.5 rounded-2xl bg-orange-50 dark:bg-[#121212] border border-orange-200 dark:border-white/10 flex items-center justify-between cursor-pointer hover:bg-orange-100/60 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Percent className="w-4 h-4 text-[#FF523B]" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">50% OFF up to $15</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">CODE: WELCOME50</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF523B]">APPLY</span>
          </div>

          <div
            onClick={() => applyCoupon('FREEDELIVERY')}
            className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-[#121212] border border-emerald-200 dark:border-white/10 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Free Delivery on $25+</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">CODE: FREEDELIVERY</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">APPLY</span>
          </div>

          <div
            onClick={() => applyCoupon('FOOD10')}
            className="p-3.5 rounded-2xl bg-blue-50 dark:bg-[#121212] border border-blue-200 dark:border-white/10 flex items-center justify-between cursor-pointer hover:bg-blue-100/60 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Flat $10 Off Banquet</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">CODE: FOOD10</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-500 dark:text-blue-400">APPLY</span>
          </div>
        </div>

        {/* Navigation Tabs (Menu | Reviews | Info) */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'menu'
                ? 'text-[#FF523B]'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Full Menu ({restaurantDishes.length})
            {activeTab === 'menu' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF523B] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'reviews'
                ? 'text-[#FF523B]'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Reviews & Ratings ({restaurant.reviewCount})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF523B] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'info'
                ? 'text-[#FF523B]'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Restaurant Info & Hygiene
            {activeTab === 'info' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF523B] rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Filter and Search Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#121212] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs">
              {/* Veg Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsVegOnly(!isVegOnly)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isVegOnly
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                      : 'border-slate-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:border-emerald-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                  <span>Veg Only</span>
                </button>
              </div>

              {/* Search dish in menu */}
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  placeholder="Search in this menu..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-slate-200 dark:border-white/10 focus:border-[#FF523B] focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {menuCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#FF523B] text-white shadow-xs'
                      : 'bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:border-[#FF523B]/50'
                  }`}
                >
                  {cat === 'all' ? 'All Dishes' : cat}
                </button>
              ))}
            </div>

            {/* Food Items List */}
            {filteredDishes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10">
                <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                  No dishes found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setIsVegOnly(false);
                    setSelectedCategory('all');
                    setMenuSearch('');
                  }}
                  className="mt-3 text-xs text-[#FF523B] font-bold hover:underline cursor-pointer"
                >
                  Reset Menu Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDishes.map(dish => (
                  <FoodCard key={dish.id} food={dish} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Rating Summary Card */}
            <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:border-r md:border-slate-200 dark:md:border-white/10 md:pr-8">
                <div className="text-5xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  {restaurant.rating}
                </div>
                <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-slate-400 dark:text-zinc-500">
                  Based on {restaurant.reviewCount} reviews
                </div>
              </div>

              {/* Breakdown bars */}
              <div className="flex-1 w-full space-y-1.5 text-xs">
                {[
                  { star: 5, pct: '78%' },
                  { star: 4, pct: '16%' },
                  { star: 3, pct: '4%' },
                  { star: 2, pct: '1%' },
                  { star: 1, pct: '1%' }
                ].map(row => (
                  <div key={row.star} className="flex items-center gap-3">
                    <span className="w-8 text-slate-500 dark:text-zinc-400">{row.star} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-[#1A1A1A] overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: row.pct }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400 dark:text-zinc-500">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  author: 'Sophia Chen',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                  rating: 5,
                  date: 'Yesterday',
                  comment:
                    'Exceptional quality! The packaging was tamper-proof, arrived blazing hot in 22 minutes, and the flavor complexity was outstanding. Best dining in town.'
                },
                {
                  id: 2,
                  author: 'Marcus Brody',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                  rating: 5,
                  date: '3 days ago',
                  comment:
                    'Ordered for our family dinner. The portions are generous and seasonings are authentic. Loved the customization options.'
                },
                {
                  id: 3,
                  author: 'Priya Sharma',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
                  rating: 4,
                  date: '1 week ago',
                  comment:
                    'Very good food and neat presentation. The delivery partner was polite and followed doorstep delivery instructions.'
                }
              ].map(rev => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-[#121212] rounded-2xl p-5 border border-slate-200 dark:border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {rev.author}
                        </h4>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">
                      <span>{rev.rating}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: RESTAURANT INFO */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-slate-200 dark:border-white/10 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                Kitchen Credentials & Hours
              </h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FF523B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Operating Hours
                    </span>
                    <span>11:00 AM – 11:30 PM (Mon – Sun)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FF523B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Full Address
                    </span>
                    <span>{restaurant.address}, {restaurant.area}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#FF523B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Contact Phone
                    </span>
                    <span>+1 (555) 392-8190</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-slate-200 dark:border-white/10 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                Hygiene & Amenities
              </h3>
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Foodora 5-Star Hygiene Certified
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Daily kitchen temperature logs, sanitized packaging & food grade containers.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2">
                  Dine-In Amenities
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10">
                    <Wind className="w-4 h-4 text-blue-500" /> Air Conditioned
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10">
                    <Wifi className="w-4 h-4 text-purple-500" /> Guest Wi-Fi
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10">
                    <Car className="w-4 h-4 text-emerald-500" /> Valet Parking
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-[#FF523B]" /> Cards & UPI
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Cart Bar (if user added items) */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 z-40 max-w-2xl mx-auto animate-in slide-in-from-bottom-3 duration-300">
          <div
            onClick={() => navigate('cart')}
            className="bg-gradient-to-r from-[#FF523B] via-[#ff462e] to-[#FF8E3B] rounded-2xl p-4 text-white shadow-2xl shadow-[#FF523B]/40 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-sm">
                {cartTotalCount}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  {cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'} added
                </div>
                <div className="text-base font-black font-['Outfit']">
                  ${cartSubtotal.toFixed(2)} subtotal
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-xs bg-white text-[#FF523B] px-4 py-2 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
