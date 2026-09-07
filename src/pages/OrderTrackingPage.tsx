import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Bike,
  Store,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { activeOrder, updateOrderStatus, reorder, navigate, showToast } = useFoodora();
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [riderProgressPct, setRiderProgressPct] = useState(35);

  const order = activeOrder;

  useEffect(() => {
    if (!order) return;
    // Map progress percentage according to status
    const statusMap: Record<OrderStatus, number> = {
      placed: 15,
      accepted: 30,
      confirmed: 35,
      preparing: 50,
      picked_up: 65,
      out_for_delivery: 82,
      delivered: 100,
      cancelled: 0
    };
    setRiderProgressPct(statusMap[order.status] || 35);
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-[#121212] text-slate-400 dark:text-zinc-500 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-4">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
          No Active Order in Tracking
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mt-1 mb-6">
          You don't have an ongoing delivery right now. Check past orders in your profile!
        </p>
        <button
          onClick={() => navigate('profile')}
          className="px-5 py-2.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-xs cursor-pointer shadow-md shadow-[#FF523B]/20"
        >
          Go to Order History
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Received and verified by Foodora' },
    { key: 'confirmed', label: 'Restaurant Confirmed', desc: 'Chef acknowledged order ticket' },
    { key: 'preparing', label: 'Food in Preparation', desc: 'Fresh ingredients sizzling on stove' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the road to your doorstep' },
    { key: 'delivered', label: 'Order Delivered', desc: 'Delivered safely with care. Enjoy!' }
  ];

  const getStepStatus = (stepKey: OrderStatus) => {
    const orderRank: Record<OrderStatus, number> = {
      placed: 1,
      accepted: 2,
      confirmed: 2,
      preparing: 3,
      picked_up: 4,
      out_for_delivery: 4,
      delivered: 5,
      cancelled: 0
    };
    const currentRank = orderRank[order.status];
    const targetRank = orderRank[stepKey];

    if (order.status === 'cancelled') return 'cancelled';
    if (currentRank > targetRank) return 'completed';
    if (currentRank === targetRank) return 'current';
    return 'upcoming';
  };

  const handleCallRider = () => {
    showToast(`Calling ${order.rider?.name || 'Rider'}...`, 'Connecting secure masked phone line', 'info');
  };

  const handleCallRestaurant = () => {
    showToast(`Calling ${order.restaurantName}...`, 'Connecting kitchen phone line', 'info');
  };

  const handleCancelOrder = () => {
    updateOrderStatus(order.id, 'cancelled');
    showToast('Order Cancelled', 'Refund of your payment initiated to original method', 'info');
  };

  const canCancel = order.status === 'placed' || order.status === 'accepted' || order.status === 'confirmed';

  return (
    <div id="order-tracking-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#FF523B] dark:text-[#FF8E3B] bg-orange-50 dark:bg-[#FF523B]/10 px-2 py-0.5 rounded-md">
              #{order.id}
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500">Placed at {order.createdAt}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-1">
            {order.status === 'delivered'
              ? 'Order Delivered!'
              : order.status === 'cancelled'
              ? 'Order Cancelled'
              : 'Tracking Live Delivery'}
          </h1>
        </div>

        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="bg-gradient-to-r from-[#FF523B] to-[#FF8E3B] text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-[#FF523B]/20">
            <Clock className="w-6 h-6 animate-pulse" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-orange-100">
                Estimated Delivery In
              </div>
              <div className="text-lg font-black font-['Outfit']">
                {order.estimatedDeliveryMinutes || 25} Minutes
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Live Route Map Simulation & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Simulated Interactive Map Display */}
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md bg-[#0A0A0A]">
            {/* Vector grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

            {/* Road path svg */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300">
              <path
                d="M 60 220 Q 180 250 250 150 T 440 80"
                fill="none"
                stroke="#333333"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 60 220 Q 180 250 250 150 T 440 80"
                fill="none"
                stroke="#FF523B"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>

            {/* Restaurant Pin */}
            <div className="absolute left-10 bottom-12 flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/50">
                <Store className="w-5 h-5" />
              </div>
              <span className="mt-1.5 px-2.5 py-0.5 rounded-md bg-[#121212]/90 text-white text-[11px] font-bold shadow-md truncate max-w-[130px] border border-white/10">
                {order.restaurantName}
              </span>
            </div>

            {/* Destination Pin */}
            <div className="absolute right-10 top-12 flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/50">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="mt-1.5 px-2.5 py-0.5 rounded-md bg-[#121212]/90 text-white text-[11px] font-bold shadow-md truncate max-w-[130px] border border-white/10">
                {order.deliveryAddress.street}
              </span>
            </div>

            {/* Moving Rider Pin */}
            <div
              className="absolute transition-all duration-1000 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${riderProgressPct}%`,
                top: `${60 - riderProgressPct * 0.3}%`
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#FF523B] text-white flex items-center justify-center shadow-2xl shadow-[#FF523B]/80 animate-bounce">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="absolute -inset-1 rounded-full bg-[#FF8E3B] opacity-40 animate-ping" />
              </div>
              <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#FF523B] text-white text-[10px] font-black uppercase tracking-wider shadow-md whitespace-nowrap">
                {order.rider?.name?.split(' ')[0] || 'Rider'} (Live)
              </span>
            </div>

            {/* Top map info pill */}
            <div className="absolute top-4 left-4 bg-[#121212]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-[#FF8E3B] animate-spin" />
              <span>Real-time GPS Telemetry Active</span>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] mb-6">
              Order Milestone Journey
            </h3>

            <div className="space-y-6 relative pl-6 border-l-2 border-slate-200 dark:border-white/10 ml-4">
              {steps.map(step => {
                const status = getStepStatus(step.key);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';

                return (
                  <div key={step.key} className="relative group">
                    <div
                      className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-[#FF523B] text-white ring-4 ring-[#FF523B]/20'
                          : 'bg-slate-200 dark:bg-[#1A1A1A] text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-[#FF523B] text-sm'
                            : isCompleted
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400 dark:text-zinc-500'
                        }`}
                      >
                        {step.label}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Rider Details, Restaurant Contacts, Collapsible Items */}
        <div className="lg:col-span-5 space-y-6">
          {/* Rider Card */}
          {order.rider && (
            <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-3 font-['Outfit']">
                Your Delivery Hero
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={order.rider.avatar || order.rider.photo}
                    alt={order.rider.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#FF523B]/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {order.rider.name}
                    </h4>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>★ {order.rider.rating}</span>
                      <span>•</span>
                      <span>{order.rider.vehicleNumber}</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Fully Vaccinated & Masked
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCallRider}
                  className="w-11 h-11 rounded-2xl bg-[#FF523B] hover:bg-[#ff3b20] text-white flex items-center justify-center shadow-md shadow-[#FF523B]/25 transition-transform active:scale-90 cursor-pointer"
                  aria-label="Call delivery partner"
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Restaurant action */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-zinc-400">Need changes to order?</span>
                <button
                  onClick={handleCallRestaurant}
                  className="text-[#FF523B] font-bold hover:underline cursor-pointer"
                >
                  Contact Kitchen
                </button>
              </div>
            </div>
          )}

          {/* Collapsible Order Breakdown */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
            <button
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Items from {order.restaurantName}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                  {order.items.length} items • ${order.grandTotal.toFixed(2)}
                </span>
              </div>
              {isSummaryOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isSummaryOpen && (
              <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/10 space-y-3">
                <div className="divide-y divide-slate-100 dark:divide-white/10 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-zinc-200">
                          {it.quantity}x
                        </span>
                        <span className="text-slate-600 dark:text-zinc-400">
                          {it.foodItem.name}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ${(it.itemPrice * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 text-xs space-y-1.5 text-slate-500 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Payment via</span>
                    <span className="uppercase font-bold text-slate-800 dark:text-zinc-200">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery destination</span>
                    <span className="font-medium text-slate-800 dark:text-zinc-200 truncate max-w-[180px]">
                      {order.deliveryAddress.street}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cancellation or Reorder Actions */}
          <div className="space-y-3">
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                className="w-full py-3 rounded-2xl border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
            )}

            {order.status === 'delivered' && (
              <button
                onClick={() => reorder(order)}
                className="w-full py-3.5 rounded-2xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold shadow-lg shadow-[#FF523B]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repeat This Order</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
