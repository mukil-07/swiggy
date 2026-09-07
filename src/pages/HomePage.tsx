import React from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  Flame,
  Star,
  Clock,
  TrendingUp,
  Percent,
  Compass,
  ChevronRight,
  ShieldCheck,
  Award,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodCard } from '../components/FoodCard';
import { CUISINES_LIST, COLLECTIONS_DATA } from '../data/mockData';

export const HomePage: React.FC = () => {
  const {
    restaurants,
    foodItems,
    orders,
    navigate,
    reorder,
    deliveryOrDiningMode,
    setDeliveryOrDiningMode,
    applyCoupon,
    offers
  } = useFoodora();

  const popularRestaurants = restaurants.slice(0, 8);
  const trendingDishes = foodItems.slice(0, 6);
  const topRatedRestaurants = restaurants.filter(r => r.rating >= 4.7).slice(0, 6);
  const newlyOpened = restaurants.filter(r => r.isNewlyOpened || r.id === 'rest-15' || r.id === 'rest-20');
  const pastOrders = orders.slice(0, 2);

  return (
    <div id="home-page" className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-transparent dark:from-[#0F0F0F] dark:via-[#0A0A0A] dark:to-transparent py-10 md:py-16 border-b border-slate-200/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-[#FF523B]/15 text-orange-700 dark:text-[#FF8E3B] text-xs font-bold mb-4 border border-orange-200 dark:border-[#FF523B]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#FF523B]" />
              <span>Next-Gen Food Discovery & Fast Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.1] font-['Outfit']">
              Craving Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF523B] to-[#FF8E3B]">Delicious</span> Today?
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Order from top Michelin-rated bistros, secret local street icons, or reserve a table for an unforgettable dining experience.
            </p>

            {/* Mode Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => setDeliveryOrDiningMode('delivery')}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  deliveryOrDiningMode === 'delivery'
                    ? 'bg-[#FF523B] text-white shadow-lg shadow-[#FF523B]/25'
                    : 'bg-white dark:bg-[#121212] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 hover:border-[#FF523B]/50'
                }`}
              >
                <span>🛵 Delivery to Doorstep</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">25-35m</span>
              </button>

              <button
                onClick={() => {
                  setDeliveryOrDiningMode('dining');
                  navigate('dining-offers');
                }}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  deliveryOrDiningMode === 'dining'
                    ? 'bg-[#FF523B] text-white shadow-lg shadow-[#FF523B]/25'
                    : 'bg-white dark:bg-[#121212] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 hover:border-[#FF523B]/50'
                }`}
              >
                <span>🍽️ Dine-in & Reservations</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                  Table Booking
                </span>
              </button>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-zinc-200">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">500+</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Curated Kitchens</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">24 mins</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Average Delivery</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">4.8 ★</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 mt-10">
        
        {/* Promotional Banner Carousel */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-3xl p-6 overflow-hidden bg-gradient-to-r from-[#FF523B] to-[#d43722] text-white shadow-lg flex flex-col justify-between h-48 border border-transparent dark:border-white/10">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  Limited Time
                </span>
                <h3 className="text-xl font-black mt-2 font-['Outfit']">50% OFF up to $15</h3>
                <p className="text-xs text-orange-100 mt-1">On your first 3 food orders with Foodora.</p>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-black/30 px-2.5 py-1 rounded-lg">
                  CODE: WELCOME50
                </span>
                <button
                  onClick={() => applyCoupon('WELCOME50')}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#FF523B] hover:bg-orange-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="relative rounded-3xl p-6 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg flex flex-col justify-between h-48 border border-transparent dark:border-white/10">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  Free Perks
                </span>
                <h3 className="text-xl font-black mt-2 font-['Outfit']">$0 Delivery Fee</h3>
                <p className="text-xs text-emerald-100 mt-1">Zero delivery fee on all orders above $25.</p>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-black/30 px-2.5 py-1 rounded-lg">
                  CODE: FREEDELIVERY
                </span>
                <button
                  onClick={() => applyCoupon('FREEDELIVERY')}
                  className="px-3 py-1.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="relative rounded-3xl p-6 overflow-hidden bg-gradient-to-r from-zinc-800 to-zinc-900 text-white shadow-lg flex flex-col justify-between h-48 border border-white/10">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  Gourmet Club
                </span>
                <h3 className="text-xl font-black mt-2 font-['Outfit']">Reserve & Dine</h3>
                <p className="text-xs text-zinc-300 mt-1">Complimentary dessert on table bookings.</p>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">Over 40 romantic spots</span>
                <button
                  onClick={() => navigate('dining-offers')}
                  className="px-3 py-1.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Book Table
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Order Again Section (If user has previous orders) */}
        {pastOrders.length > 0 && (
          <section className="bg-orange-50/60 dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-orange-200/60 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF523B] text-white flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                    Order Again
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Quick 1-click reorder from your past favorites</p>
                </div>
              </div>
              <button
                onClick={() => navigate('profile')}
                className="text-xs font-bold text-[#FF523B] hover:underline"
              >
                View all orders →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pastOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={order.restaurantImage}
                      alt={order.restaurantName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {order.restaurantName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {order.items.length} items • ${order.grandTotal.toFixed(2)}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Delivered on {order.createdAt}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => reorder(order)}
                    className="px-4 py-2 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Cuisines Carousel */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Inspiration For Your First Order
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Explore authentic culinary specialties</p>
            </div>
            <button
              onClick={() => navigate('restaurants')}
              className="text-xs font-bold text-[#FF523B] hover:underline flex items-center gap-1"
            >
              <span>See all</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
            {CUISINES_LIST.map((cuisine, idx) => (
              <button
                key={idx}
                onClick={() => navigate('restaurants')}
                className="flex flex-col items-center gap-2 p-3 min-w-[100px] rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-white/10 hover:border-[#FF523B] dark:hover:border-[#FF523B]/60 transition-all hover:-translate-y-1 shadow-2xs group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cuisine.icon}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-[#FF523B] text-center">
                  {cuisine.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Restaurants Near You */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Popular Restaurants Near You
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Fast delivery, exceptional hygiene and highest ratings</p>
            </div>
            <button
              onClick={() => navigate('restaurants')}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 hover:border-[#FF523B] text-xs font-bold text-slate-700 dark:text-zinc-200 hover:text-[#FF523B] transition-colors cursor-pointer"
            >
              Explore all {restaurants.length} kitchens
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRestaurants.map(rest => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        </section>

        {/* Trending Dishes Carousel */}
        <section className="bg-slate-100/70 dark:bg-[#0F0F0F] rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF523B] uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-current" />
                <span>Trending Right Now</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Crowd-Favorite Dishes
              </h2>
            </div>
            <button
              onClick={() => navigate('restaurants')}
              className="text-xs font-bold text-[#FF523B] hover:underline"
            >
              Browse complete menu →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingDishes.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

        {/* Collections Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Curated Collections
              </h2>
              <p className="text-xs text-slate-500">Handcrafted food itineraries for every mood</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COLLECTIONS_DATA.map(col => (
              <div
                key={col.id}
                onClick={() => navigate('restaurants')}
                className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {col.placesCount}
                  </span>
                  <h3 className="text-lg font-black mt-1 font-['Outfit'] group-hover:text-orange-400 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top-Rated & Newly Opened */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top-Rated */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Top-Rated Epicurean Spots (4.8+)</span>
              </h3>
            </div>
            <div className="space-y-4">
              {topRatedRestaurants.slice(0, 3).map(r => (
                <RestaurantCard key={r.id} restaurant={r} viewMode="list" />
              ))}
            </div>
          </div>

          {/* Newly Opened */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span>Newly Opened & Buzzing</span>
              </h3>
            </div>
            <div className="space-y-4">
              {newlyOpened.map(r => (
                <RestaurantCard key={r.id} restaurant={r} viewMode="list" />
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
