import React, { useState } from 'react';
import {
  Tag,
  Percent,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Star,
  MapPin,
  Clock,
  Wine,
  UtensilsCrossed,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { Restaurant } from '../types';

export const OffersDiningPage: React.FC = () => {
  const {
    offers,
    restaurants,
    applyCoupon,
    openReservationModal,
    navigate,
    showToast
  } = useFoodora();

  const [subTab, setSubTab] = useState<'dining' | 'offers'>('dining');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dining eligible restaurants (high rated, premium ambiance, dine-in seating)
  const diningRestaurants = restaurants.filter(
    r => r.rating >= 4.6 || r.isPromoted || r.id === 'rest-2' || r.id === 'rest-3'
  );

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast(`Code '${code}' copied!`, 'Paste or apply at checkout', 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div id="dining-offers-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white mb-8 border border-slate-800 shadow-xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Wine className="w-3.5 h-3.5" />
            <span>Curated Fine Dining & Exclusive Promocodes</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight">
            Reserve Premium Tables & Save Big
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Skip the waiting queue with guaranteed reservations, or take advantage of bank vouchers and secret foodie discount codes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-8 relative z-10">
          <button
            onClick={() => setSubTab('dining')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'dining'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservations ({diningRestaurants.length})</span>
          </button>

          <button
            onClick={() => setSubTab('offers')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'offers'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discounts & Vouchers ({offers.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DINING TABLE RESERVATIONS */}
      {subTab === 'dining' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Book a Table at Top Epicurean Spots
              </h2>
              <p className="text-xs text-slate-500">
                Instant confirmation • Complimentary welcome treats • Free cancellation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diningRestaurants.map(restaurant => (
              <div
                key={restaurant.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={restaurant.bannerImage || restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {restaurant.cuisines[0]}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-semibold text-slate-200">
                        {restaurant.area}
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-600 px-2 py-0.5 rounded-md text-xs font-bold">
                        <span>{restaurant.rating}</span>
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {restaurant.address}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 dark:text-slate-300">
                      <span>${restaurant.priceForTwo} for two</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Tables Open Tonight
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => navigate('restaurant-detail', restaurant.id)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-orange-400 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => openReservationModal(restaurant)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Table</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: OFFERS & PROMOCODES */}
      {subTab === 'offers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Active Promocodes & Foodora Coupons
              </h2>
              <p className="text-xs text-slate-500">
                Click any voucher code to copy or apply directly to your active cart.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map(offer => {
              const isCopied = copiedCode === offer.code;

              return (
                <div
                  key={offer.id}
                  className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">
                      {offer.discountType === 'percentage'
                        ? `${offer.discountValue}% OFF`
                        : offer.discountType === 'flat'
                        ? `$${offer.discountValue} OFF`
                        : 'FREE DELIVERY'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Valid until {offer.validUntil}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="mt-3 text-[11px] text-slate-400 space-y-0.5">
                      <div>• Min order value: ${offer.minOrderValue}</div>
                      {offer.maxDiscount && <div>• Max discount capped at: ${offer.maxDiscount}</div>}
                    </div>
                  </div>

                  {/* Code box and copy/apply action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 font-mono font-black text-xs text-slate-900 dark:text-white tracking-wider border border-slate-200 dark:border-slate-600">
                      {offer.code}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        aria-label="Copy code"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          applyCoupon(offer.code);
                          navigate('cart');
                        }}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        Apply Code
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
