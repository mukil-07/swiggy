import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, Check, Sparkles, Flame, Clock } from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { FoodCustomizationSize, FoodAddOn } from '../types';

export const FoodDetailModal: React.FC = () => {
  const {
    isFoodModalOpen,
    setIsFoodModalOpen,
    selectedFoodForModal,
    addToCart,
    navigate
  } = useFoodora();

  const food = selectedFoodForModal;

  const [selectedSize, setSelectedSize] = useState<FoodCustomizationSize | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<FoodAddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (food) {
      // Default to first size if available
      if (food.sizes && food.sizes.length > 0) {
        setSelectedSize(food.sizes[0]);
      } else {
        setSelectedSize(undefined);
      }
      setSelectedAddOns([]);
      setQuantity(1);
    }
  }, [food]);

  if (!isFoodModalOpen || !food) return null;

  const sizeDelta = selectedSize ? selectedSize.priceDelta : 0;
  const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = food.price + sizeDelta + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addon: FoodAddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(food, selectedSize, selectedAddOns, quantity);
    setIsFoodModalOpen(false);
  };

  const handleBuyNow = () => {
    addToCart(food, selectedSize, selectedAddOns, quantity);
    setIsFoodModalOpen(false);
    navigate('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="food-detail-modal"
        className="relative w-full max-w-xl bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsFoodModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Food Photography */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-100 dark:bg-zinc-900">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
                    food.isVeg ? 'border-emerald-400' : 'border-red-500'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      food.isVeg ? 'bg-emerald-400' : 'bg-red-500'
                    }`}
                  />
                </span>

                <span className="text-xs font-semibold text-slate-200">
                  {food.restaurantName}
                </span>

                {food.isBestseller && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF8E3B] text-slate-950 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Bestseller
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-['Outfit']">
                {food.name}
              </h2>
            </div>
          </div>

          {/* Body Information */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Meta row: Rating, Calories, Prep Time */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  <span>{food.rating}</span>
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  ({food.ratingCount} verified food reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                {food.calories && (
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#FF523B]" />
                    {food.calories} kcal
                  </span>
                )}
                {food.prepTimeMinutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    ~{food.prepTimeMinutes} mins
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5 font-['Outfit']">
                Description
              </h4>
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                {food.description}
              </p>
            </div>

            {/* Ingredients Chips */}
            {food.ingredients && food.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2 font-['Outfit']">
                  Fresh Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {food.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customization: Size */}
            {food.sizes && food.sizes.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-['Outfit']">
                    Choose Portion Size <span className="text-[#FF523B]">*</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500">Select 1</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {food.sizes.map((s, idx) => {
                    const isSelected = selectedSize?.name === s.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF523B] bg-orange-50/60 dark:bg-[#FF523B]/10 text-[#FF523B] ring-2 ring-[#FF523B]/20'
                            : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {s.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FF523B]" />}
                        </div>
                        <div className="text-xs mt-1 text-slate-500 dark:text-zinc-400">
                          {s.priceDelta === 0 ? 'Base price' : `+$${s.priceDelta.toFixed(2)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization: Add-ons */}
            {food.addOns && food.addOns.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-['Outfit']">
                    Add-ons & Extras
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500">Optional</span>
                </div>
                <div className="space-y-2">
                  {food.addOns.map(addon => {
                    const isSelected = selectedAddOns.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#FF523B] bg-orange-50/50 dark:bg-[#FF523B]/10'
                            : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#FF523B] border-[#FF523B] text-white'
                                : 'border-slate-300 dark:border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-medium text-slate-800 dark:text-zinc-200">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          +${addon.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Dynamic Price & Dual CTAs */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0A0A0A] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500 block">
                Total Price
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10 rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-600 dark:text-zinc-300 active:scale-95 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-black text-slate-800 dark:text-zinc-200">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-600 dark:text-zinc-300 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-[#FF523B] text-[#FF523B] hover:bg-[#FF523B]/10 font-bold text-xs transition-colors cursor-pointer active:scale-95"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-xs shadow-lg shadow-[#FF523B]/25 transition-all cursor-pointer active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
