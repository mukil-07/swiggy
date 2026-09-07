import React, { useState } from 'react';
import {
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  UtensilsCrossed,
  ChefHat,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { OrderStatus } from '../types';

export const RestaurantPartnerDashboardPage: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    foodItems,
    setFoodItems,
    restaurants,
    showToast,
    navigate
  } = useFoodora();

  // Pick first restaurant as merchant's business
  const currentRest = restaurants[0];

  const incomingOrders = orders.filter(
    o => o.status === 'placed' || o.status === 'confirmed' || o.status === 'preparing'
  );

  const completedOrders = orders.filter(o => o.status === 'delivered');

  const restFoodItems = foodItems.filter(f => f.restaurantId === currentRest.id);

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed');
    showToast('Order Accepted', 'Kitchen notification sent to chefs', 'success');
  };

  const handleStartPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
    showToast('Food in Preparation', 'Rider alerted for upcoming pickup', 'info');
  };

  const handleReadyForPickup = (orderId: string) => {
    updateOrderStatus(orderId, 'out_for_delivery');
    showToast('Handed to Delivery Partner', 'Rider en route to customer', 'success');
  };

  const toggleAvailability = (foodId: string) => {
    setFoodItems(
      foodItems.map(f => (f.id === foodId ? { ...f, isAvailable: !f.isAvailable } : f))
    );
    showToast('Inventory Updated', undefined, 'info');
  };

  return (
    <div id="restaurant-partner-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full mb-1">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Foodora Merchant & Kitchen Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            {currentRest.name} • Kitchen Terminal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept online orders in real time, adjust item availability, and dispatch deliveries.
          </p>
        </div>

        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-orange-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
        >
          ← Back to Customer App
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-['Outfit']">
            <span>Today's Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            $1,840.50
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">+12% vs yesterday</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-['Outfit']">
            <span>Active Kitchen Orders</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            {incomingOrders.length}
          </div>
          <span className="text-[11px] text-orange-600 font-bold">Avg prep: 14 mins</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-['Outfit']">
            <span>Kitchen Rating</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            ★ {currentRest.rating}
          </div>
          <span className="text-[11px] text-slate-400">98% positive reviews</span>
        </div>
      </div>

      {/* Main Sections: Live Incoming Orders Queue & Inventory Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Live Orders Queue (Left 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Live Kitchen Order Tickets ({incomingOrders.length})</span>
            </h3>
          </div>

          {incomingOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">All caught up!</h4>
              <p className="text-xs text-slate-400 mt-1">
                No pending kitchen tickets right now. Waiting for new customer orders.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <span className="font-mono font-bold text-xs text-orange-600 dark:text-orange-400">
                        #{order.id}
                      </span>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        Customer: {order.userName}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {it.quantity}x {it.foodItem.name}
                        </span>
                        <span className="text-slate-500">
                          ${(it.unitPrice * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.deliveryInstructions && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs">
                      <strong>Chef Note:</strong> {order.deliveryInstructions}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        Accept & Notify Chef
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleStartPreparing(order.id)}
                        className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        Start Cooking Dish
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleReadyForPickup(order.id)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        Pack & Handover to Rider
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Availability Controls (Right 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            <span>Fast Stock & Out-of-Stock Toggle</span>
          </h3>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <p className="text-xs text-slate-500">
              Ran out of ingredients? Mark dishes out of stock instantly to prevent cancellations.
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {restFoodItems.map(dish => (
                <div key={dish.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {dish.name}
                      </h5>
                      <span className="text-[11px] font-black text-slate-500">
                        ${dish.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAvailability(dish.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      dish.isAvailable
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 dark:bg-red-950 text-red-600 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
