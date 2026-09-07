import React from 'react';
import { Star, Plus, Minus, Heart, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';
import { useFoodora } from '../context/FoodoraContext';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const {
    openFoodDetail,
    addToCart,
    updateCartQuantity,
    cart,
    toggleFavoriteFood,
    isFoodFavorite
  } = useFoodora();

  const isFav = isFoodFavorite(food.id);

  // Find total count of this food item in cart across customizations
  const itemsInCart = cart.filter(c => c.foodItem.id === food.id);
  const totalCountInCart = itemsInCart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If the food item has sizes or add-ons, open the customization modal
    if ((food.sizes && food.sizes.length > 0) || (food.addOns && food.addOns.length > 0)) {
      openFoodDetail(food);
    } else {
      addToCart(food);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (itemsInCart.length === 1) {
      updateCartQuantity(itemsInCart[0].cartItemId, 1);
    } else {
      openFoodDetail(food);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (itemsInCart.length === 1) {
      updateCartQuantity(itemsInCart[0].cartItemId, -1);
    } else {
      openFoodDetail(food);
    }
  };

  return (
    <div
      id={`food-card-${food.id}`}
      onClick={() => openFoodDetail(food)}
      className="group relative bg-white dark:bg-[#121212] rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-all cursor-pointer hover:border-[#FF523B]/40 dark:hover:border-white/20"
    >
      {/* Left Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Veg/Non-Veg icon & badges */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
                food.isVeg
                  ? 'border-emerald-600 dark:border-emerald-500'
                  : 'border-red-600 dark:border-red-500'
              }`}
              title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  food.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              />
            </span>

            {food.isBestseller && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-[#FF8E3B]/20 dark:text-[#FF8E3B] border border-transparent dark:border-[#FF8E3B]/30">
                <Sparkles className="w-3 h-3 text-[#FF523B]" /> Bestseller
              </span>
            )}
          </div>

          {/* Name */}
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#FF523B] transition-colors font-['Outfit']">
            {food.name}
          </h4>

          {/* Price & Rating */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 dark:text-white">
                ${food.price.toFixed(2)}
              </span>
              {food.originalPrice && (
                <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                  ${food.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Star className="w-3.5 h-3.5 fill-current text-emerald-600" />
              <span>{food.rating}</span>
              <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-normal">
                ({food.ratingCount})
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Customization hint */}
        {((food.sizes && food.sizes.length > 0) || (food.addOns && food.addOns.length > 0)) && (
          <span className="text-[11px] text-[#FF523B] font-semibold mt-2 block">
            Customizable options available →
          </span>
        )}
      </div>

      {/* Right Image & Action */}
      <div className="relative w-full sm:w-36 h-36 shrink-0 flex flex-col items-center">
        <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 relative">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Favorite dish button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteFood(food.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xs border border-transparent dark:border-white/10 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all"
            aria-label="Favorite dish"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFav ? 'fill-[#FF523B] text-[#FF523B]' : 'text-slate-600 dark:text-zinc-300'
              }`}
            />
          </button>
        </div>

        {/* Add / Quantity Button */}
        <div className="absolute -bottom-2 z-10 w-28">
          {!food.isAvailable ? (
            <div className="bg-slate-200 dark:bg-white/5 border border-transparent dark:border-white/10 text-slate-500 dark:text-zinc-500 text-xs font-bold py-1.5 rounded-lg text-center shadow-xs">
              Sold Out
            </div>
          ) : totalCountInCart > 0 ? (
            <div className="flex items-center justify-between bg-[#FF523B] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF523B]/25 px-2 py-1.5">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 rounded-md hover:bg-black/20 flex items-center justify-center cursor-pointer active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-sm font-black">{totalCountInCart}</span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 rounded-md hover:bg-black/20 flex items-center justify-center cursor-pointer active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="w-full bg-white dark:bg-[#121212] border-2 border-[#FF523B] text-[#FF523B] hover:bg-[#FF523B] hover:text-white text-xs font-black py-1.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
