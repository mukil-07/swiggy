import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Calendar,
  Settings,
  LogOut,
  RotateCcw,
  Clock,
  Sparkles,
  Trash2,
  Edit2,
  CheckCircle2,
  Sun,
  Moon,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodCard } from '../components/FoodCard';

export const UserProfilePage: React.FC = () => {
  const {
    user,
    updateUserProfile,
    orders,
    addAddress,
    deleteAddress,
    restaurants,
    foodItems,
    reservations,
    reorder,
    navigate,
    theme,
    toggleTheme,
    logoutUser,
    showToast
  } = useFoodora();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'addresses' | 'favorites' | 'reservations' | 'settings'
  >('orders');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);

  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');

  const favRestaurants = restaurants.filter(r => user.favoriteRestaurantIds?.includes(r.id));
  const favFoods = foodItems.filter(f => user.favoriteFoodIds?.includes(f.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      email: editEmail,
      phone: editPhone
    });
    setIsEditingProfile(false);
    showToast('Profile updated!', undefined, 'success');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    addAddress({
      type: newType,
      street: newStreet,
      city: newCity || 'Metropolis',
      postalCode: '10001',
      phone: user.phone,
      isDefault: false
    });
    setIsAddingAddr(false);
    setNewStreet('');
    setNewCity('');
  };

  return (
    <div id="user-profile-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Top Profile Summary Header */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#FF523B]/20 shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#121212]" />
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                {user.name}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-amber-300/30">
                <Sparkles className="w-3 h-3" /> Gold
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              {user.email} • {user.phone}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-400 dark:text-zinc-500">
              <span>{orders.length} Total Orders</span>
              <span>•</span>
              <span>{user.favoriteRestaurantIds?.length || 0} Saved Places</span>
              <span>•</span>
              <span>{reservations.length} Reservations</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 hover:border-[#FF523B] text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#FF523B]" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-red-200/40 dark:border-red-800/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form Popup */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-slate-200 dark:border-white/10 mb-8 max-w-xl mx-auto shadow-xl space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
            Edit Account Details
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={e => setEditEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-white/10 scrollbar-none">
        {[
          { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
          { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> },
          { id: 'reservations', label: 'Table Bookings', icon: <Calendar className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FF523B] text-white shadow-md shadow-[#FF523B]/20'
                  : 'bg-white dark:bg-[#121212] text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] border border-slate-200/80 dark:border-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10">
              <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No orders yet
              </h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                Your future culinary journeys will appear here!
              </p>
              <button
                onClick={() => navigate('restaurants')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#FF523B]/20"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={order.restaurantImage}
                    alt={order.restaurantName}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                        {order.restaurantName}
                      </h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border dark:border-emerald-800/40'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border dark:border-red-800/40'
                            : 'bg-orange-100 text-orange-800 dark:bg-[#FF523B]/10 dark:text-[#FF8E3B] border dark:border-[#FF523B]/30 animate-pulse'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      {order.items.map(i => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
                    </div>

                    <div className="text-xs text-slate-400 dark:text-zinc-500 mt-2 flex items-center gap-3">
                      <span>Order #{order.id}</span>
                      <span>•</span>
                      <span>{order.createdAt}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-100">
                        ${order.grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                    <button
                      onClick={() => navigate('order-tracking', undefined, order.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold shadow-md shadow-[#FF523B]/20 cursor-pointer"
                    >
                      Track Live Delivery
                    </button>
                  ) : (
                    <button
                      onClick={() => reorder(order)}
                      className="px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-[#FF523B]/10 text-orange-600 dark:text-[#FF8E3B] hover:bg-orange-100 dark:hover:bg-[#FF523B]/20 border border-orange-200 dark:border-[#FF523B]/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
              Saved Locations for Instant Delivery
            </h3>
            <button
              onClick={() => setIsAddingAddr(!isAddingAddr)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {isAddingAddr && (
            <form
              onSubmit={handleCreateAddress}
              className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 space-y-3"
            >
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewType(lbl)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      newType === lbl ? 'bg-[#FF523B] text-white' : 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-zinc-300 border border-transparent dark:border-white/5'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={newStreet}
                onChange={e => setNewStreet(e.target.value)}
                placeholder="Street address / apartment"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
              />
              <input
                type="text"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                placeholder="City / Area (e.g. Midtown Metropolis)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF523B]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddr(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.savedAddresses.map(addr => (
              <div
                key={addr.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF523B]" />
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300">
                    {addr.street}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                    {addr.city}, {addr.postalCode}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit'] mb-4">
              Saved Restaurants ({favRestaurants.length})
            </h3>
            {favRestaurants.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500">No favorite restaurants saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favRestaurants.map(r => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit'] mb-4">
              Saved Dishes ({favFoods.length})
            </h3>
            {favFoods.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500">No favorite dishes bookmarked yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favFoods.map(f => (
                  <FoodCard key={f.id} food={f} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
            Your Table Reservations
          </h3>
          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 dark:text-zinc-500">No table bookings yet.</p>
              <button
                onClick={() => navigate('dining-offers')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#FF523B]/20"
              >
                Browse Fine Dining
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reservations.map(res => (
                <div
                  key={res.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex items-start justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                      {res.status}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] mt-2">
                      {res.restaurantName}
                    </h4>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1 space-y-0.5">
                      <div>📅 {res.date} at {res.timeSlot}</div>
                      <div>👥 {res.guests} Guests ({res.guestName})</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500">
                    #{res.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl space-y-4">
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Theme Preference</h4>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Currently using {theme} mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-transparent dark:border-white/10 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FF8E3B]" /> : <Moon className="w-4 h-4" />}
              <span>Toggle</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Order SMS & Push Alerts</h4>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Receive live status updates on your device</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded text-[#FF523B] accent-[#FF523B] focus:ring-[#FF523B]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
