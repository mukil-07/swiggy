import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  Users,
  CheckCircle2,
  Trash2,
  Edit2,
  Plus,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { Restaurant, FoodItem, OrderStatus } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    restaurants,
    addRestaurant,
    deleteRestaurant,
    foodItems,
    toggleFoodAvailability,
    orders,
    updateOrderStatus,
    offers,
    showToast,
    navigate
  } = useFoodora();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'restaurants' | 'menu' | 'orders' | 'coupons'
  >('overview');

  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [foodSearch, setFoodSearch] = useState('');

  // Form states for adding a new restaurant
  const [isAddingRest, setIsAddingRest] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestCuisines, setNewRestCuisines] = useState('');
  const [newRestArea, setNewRestArea] = useState('');
  const [newRestPrice, setNewRestPrice] = useState('35');

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0) + 14850;
  const totalOrdersCount = orders.length + 324;
  const activeDeliveries = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    addRestaurant({
      name: newRestName,
      slug: newRestName.toLowerCase().replace(/\s+/g, '-'),
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700',
      bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      cuisines: newRestCuisines.split(',').map(c => c.trim()),
      rating: 4.8,
      reviewsCount: 1,
      deliveryTimeMin: 25,
      deliveryTimeMax: 35,
      distanceKm: 2.1,
      priceForTwo: Number(newRestPrice) || 35,
      isVegOnly: false,
      isOpen: true,
      address: `${newRestArea || 'Downtown'} Main Boulevard`,
      city: 'Metropolis',
      area: newRestArea || 'Downtown',
      contactNumber: '+1 (555) 234-5678',
      openingHours: '10:00 AM - 11:00 PM',
      hygieneScore: '4.8/5 (Inspected)',
      facilities: ['Dine-in', 'Takeaway', 'Valet Parking', 'Free Wi-Fi'],
      diningAvailable: true,
      diningRating: 4.7,
      diningPriceForTwo: Number(newRestPrice) || 35,
      tableReservationAvailable: true,
      isPromoted: true,
      offerBadge: '20% OFF'
    });

    setIsAddingRest(false);
    setNewRestName('');
    setNewRestCuisines('');
    setNewRestArea('');
  };

  const handleDeleteRestaurant = (id: string, name: string) => {
    if (confirm(`Remove ${name} from platform?`)) {
      deleteRestaurant(id);
    }
  };

  const handleToggleFoodStock = (foodId: string) => {
    toggleFoodAvailability(foodId);
  };

  return (
    <div id="admin-dashboard-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF523B] dark:text-[#FF8E3B] bg-orange-50 dark:bg-[#FF523B]/10 border border-orange-200/50 dark:border-[#FF523B]/20 px-2.5 py-1 rounded-full mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            Operations & Analytics Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('home')}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 hover:border-[#FF523B] text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            ← Back to Customer App
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-['Outfit']">
              Total GMV Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last week
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-['Outfit']">
              Orders Dispatched
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-[#FF523B]/10 text-[#FF523B] flex items-center justify-center border border-[#FF523B]/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
            {activeDeliveries} live on road right now
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-['Outfit']">
              Partner Kitchens
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            {restaurants.length}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1">
            100% health inspected
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-['Outfit']">
              Active Dishes Listed
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-[#1A1A1A] text-purple-600 dark:text-zinc-300 flex items-center justify-center border border-purple-500/20 dark:border-white/10">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-2">
            {foodItems.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Across all categories</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-white/10">
        {[
          { id: 'overview', label: 'Overview & Activity' },
          { id: 'restaurants', label: `Manage Restaurants (${restaurants.length})` },
          { id: 'menu', label: `Manage Food Items (${foodItems.length})` },
          { id: 'orders', label: `Live Orders (${orders.length})` },
          { id: 'coupons', label: `Promocodes (${offers.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminTab === tab.id
                ? 'bg-[#FF523B] text-white shadow-md shadow-[#FF523B]/20'
                : 'bg-white dark:bg-[#121212] text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] border border-slate-200 dark:border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: RESTAURANTS */}
      {activeAdminTab === 'restaurants' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={restaurantSearch}
                onChange={e => setRestaurantSearch(e.target.value)}
                placeholder="Search registered restaurants..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => setIsAddingRest(!isAddingRest)}
              className="px-4 py-2.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shadow-[#FF523B]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New Restaurant</span>
            </button>
          </div>

          {/* Add Restaurant Form */}
          {isAddingRest && (
            <form
              onSubmit={handleAddRestaurant}
              className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 space-y-4 max-w-xl shadow-lg"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
                Onboard New Culinary Partner
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={e => setNewRestName(e.target.value)}
                  placeholder="e.g. Saffron Luxe Bistro"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">
                    Cuisines (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={newRestCuisines}
                    onChange={e => setNewRestCuisines(e.target.value)}
                    placeholder="Italian, Wood-fired, Desserts"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">
                    Area / Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    value={newRestArea}
                    onChange={e => setNewRestArea(e.target.value)}
                    placeholder="Midtown"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRest(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Approve & Onboard
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1A1A1A] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-4">Restaurant</th>
                  <th className="p-4">Cuisines</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Avg Cost</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10 text-slate-700 dark:text-zinc-200">
                {restaurants
                  .filter(r => r.name.toLowerCase().includes(restaurantSearch.toLowerCase()))
                  .map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold flex items-center gap-3">
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <span>{r.name}</span>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-zinc-400">{r.cuisines.join(', ')}</td>
                      <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">★ {r.rating}</td>
                      <td className="p-4">${r.priceForTwo}</td>
                      <td className="p-4 text-slate-500 dark:text-zinc-400">{r.area}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteRestaurant(r.id, r.name)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MENU ITEMS */}
      {activeAdminTab === 'menu' && (
        <div className="space-y-6">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={foodSearch}
              onChange={e => setFoodSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1A1A1A] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Kitchen</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Toggle Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10 text-slate-700 dark:text-zinc-200">
                {foodItems
                  .filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
                  .map(f => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold flex items-center gap-3">
                        <img
                          src={f.image}
                          alt={f.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <span>{f.name}</span>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-zinc-400">{f.restaurantName}</td>
                      <td className="p-4 uppercase text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                        {f.category}
                      </td>
                      <td className="p-4 font-black">${f.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            f.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border border-red-500/20'
                          }`}
                        >
                          {f.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleFoodStock(f.id)}
                          className="px-3 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#FF523B] text-xs font-semibold cursor-pointer dark:hover:bg-white/5"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1A1A1A] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Restaurant</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10 text-slate-700 dark:text-zinc-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold">#{order.id}</td>
                    <td className="p-4">{order.restaurantName}</td>
                    <td className="p-4">{order.userName}</td>
                    <td className="p-4 font-black">${order.grandTotal.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-[#FF523B]/15 dark:text-[#FF8E3B] border border-orange-200/50 dark:border-[#FF523B]/30 uppercase">
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs outline-none text-slate-800 dark:text-zinc-200"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeAdminTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map(off => (
            <div
              key={off.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#FF523B] dark:text-[#FF8E3B] text-sm">
                  {off.code}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{off.title}</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{off.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] mb-4">
              Real-Time Activity Feed
            </h3>
            <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-300">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#1A1A1A] border border-transparent dark:border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Order #ORD-8921 Delivered</div>
                  <div className="text-slate-400 dark:text-zinc-500">Rider David Miller completed delivery in 24m.</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#1A1A1A] border border-transparent dark:border-white/5">
                <Store className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">New Kitchen Verified</div>
                  <div className="text-slate-400 dark:text-zinc-500">L'Osteria Bella passed 5-star hygiene audit.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] mb-4">
              System Health & Diagnostics
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/10">
                <span className="text-slate-500 dark:text-zinc-400">API Latency</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">32ms (Nominal)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/10">
                <span className="text-slate-500 dark:text-zinc-400">Payment Gateway Handshake</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">99.98% Success</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/10">
                <span className="text-slate-500 dark:text-zinc-400">GPS Rider Telemetry Node</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Connected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
