import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  CheckCircle2,
  DollarSign,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Power
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';

export const DeliveryPartnerPage: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    showToast,
    navigate
  } = useFoodora();

  const [isOnline, setIsOnline] = useState(true);

  // Active delivery on rider's assignment
  const activeDelivery = orders.find(
    o => o.status === 'out_for_delivery' || o.status === 'preparing'
  );

  const completedToday = orders.filter(o => o.status === 'delivered');
  const todayEarnings = completedToday.length * 7.5 + 15; // base pay + tips

  const handleArrivedAtCustomer = () => {
    if (!activeDelivery) return;
    updateOrderStatus(activeDelivery.id, 'delivered');
    showToast('Delivery Marked Complete!', 'Earned +$7.50 + Customer Tip', 'success');
  };

  return (
    <div id="delivery-partner-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Top Header with Online Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full mb-1">
            <Bike className="w-3.5 h-3.5" />
            <span>Foodora Fleet Driver App</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            Driver Console • David Miller
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vehicle: Honda Activa (NY-9824) • Rating: ★ 4.92
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'Online (Accepting Trips)' : 'Offline (Duty Off)'}</span>
          </button>

          <button
            onClick={() => navigate('home')}
            className="px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-orange-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Customer App
          </button>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-['Outfit']">
            <span>Today's Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            ${todayEarnings.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">Includes $15.00 tips</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-['Outfit']">
            <span>Completed Trips</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            {completedToday.length + 8}
          </div>
          <span className="text-[11px] text-slate-400">100% on-time rate</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-['Outfit']">
            <span>Total Driving Time</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            4h 15m
          </div>
          <span className="text-[11px] text-slate-400">Shift ends at 9:00 PM</span>
        </div>
      </div>

      {/* Active Trip or Idle State */}
      <div className="max-w-2xl mx-auto">
        {!isOnline ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <Power className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              You are currently Offline
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Switch on duty to start receiving delivery requests nearby.
            </p>
            <button
              onClick={() => setIsOnline(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Go Online Now
            </button>
          </div>
        ) : activeDelivery ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 animate-pulse">
                Active Delivery In Progress
              </span>
              <span className="font-mono font-bold text-xs text-slate-400">
                Order #{activeDelivery.id}
              </span>
            </div>

            {/* Trip Route Details */}
            <div className="space-y-4 relative pl-6 border-l-2 border-dashed border-orange-400 ml-3">
              <div className="relative">
                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pickup From
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeDelivery.restaurantName}
                </h4>
                <p className="text-xs text-slate-500">
                  Main Kitchen Counter • Order Package Ready
                </p>
              </div>

              <div className="relative pt-3">
                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Deliver To
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeDelivery.userName}
                </h4>
                <p className="text-xs text-slate-500">
                  {activeDelivery.deliveryAddress.street}, {activeDelivery.deliveryAddress.city}
                </p>
                {activeDelivery.deliveryInstructions && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs">
                    <strong>Customer Note:</strong> {activeDelivery.deliveryInstructions}
                  </div>
                )}
              </div>
            </div>

            {/* Complete Delivery Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => showToast('Opening GPS Navigation...', 'Navigating via Maps', 'info')}
                className="flex-1 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-orange-500 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-orange-500" />
                <span>Open Turn-by-Turn GPS</span>
              </button>

              <button
                onClick={handleArrivedAtCustomer}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Delivered</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Bike className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Looking for Nearby Delivery Orders...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You are in high demand in Midtown! Stay parked near popular restaurants to receive orders faster.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
