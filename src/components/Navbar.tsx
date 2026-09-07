import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShoppingBag,
  User,
  Sun,
  Moon,
  Bell,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
  Compass,
  Tag,
  Clock,
  ShieldAlert,
  Store,
  Bike,
  Check,
  Trash2,
  X
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { PageType } from '../types';

export const Navbar: React.FC = () => {
  const {
    page,
    navigate,
    location,
    setIsLocationModalOpen,
    cartTotalCount,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    deliveryOrDiningMode,
    setDeliveryOrDiningMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    user,
    isLoggedIn,
    setIsAuthModalOpen,
    setAuthModalMode,
    logoutUser
  } = useFoodora();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPortalsOpen, setIsPortalsOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const portalsRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (portalsRef.current && !portalsRef.current.contains(e.target as Node)) {
        setIsPortalsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('search');
    }
  };

  const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'restaurants', label: 'Restaurants', icon: <Compass className="w-4 h-4" /> },
    { id: 'dining-offers', label: 'Dining & Offers', icon: <Tag className="w-4 h-4" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'profile', label: 'Orders', icon: <Clock className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-xs transition-colors duration-200">
      {/* Top Banner Bar for Delivery/Dining switch & quick portals */}
      <div className="bg-slate-900 dark:bg-[#0F0F0F] text-slate-300 dark:text-zinc-400 text-xs px-4 py-1.5 hidden md:block border-b border-slate-800 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 dark:text-[#FF8E3B] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#FF523B]" />
              Special Launch Deal: Use code <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-mono tracking-wide border border-white/10">WELCOME50</strong> for 50% off
            </span>
            <span className="text-slate-500 dark:text-white/20">|</span>
            <div className="inline-flex rounded-md p-0.5 bg-slate-800 dark:bg-white/5 border border-transparent dark:border-white/5">
              <button
                onClick={() => setDeliveryOrDiningMode('delivery')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                  deliveryOrDiningMode === 'delivery'
                    ? 'bg-[#FF523B] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🛵 Delivery
              </button>
              <button
                onClick={() => {
                  setDeliveryOrDiningMode('dining');
                  navigate('dining-offers');
                }}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                  deliveryOrDiningMode === 'dining'
                    ? 'bg-[#FF523B] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🍽️ Dining & Tables
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Portals Switcher */}
            <div className="relative" ref={portalsRef}>
              <button
                onClick={() => setIsPortalsOpen(!isPortalsOpen)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="text-emerald-400 font-semibold text-[11px]">Portals View</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isPortalsOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#121212] rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 py-1.5 z-50 text-slate-800 dark:text-zinc-200">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Switch Workspace
                  </div>
                  <button
                    onClick={() => {
                      navigate('home');
                      setIsPortalsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#FF523B]" />
                    <span>Customer App</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('admin');
                      setIsPortalsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('restaurant-partner');
                      setIsPortalsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Store className="w-3.5 h-3.5 text-blue-400" />
                    <span>Restaurant Partner</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('delivery-partner');
                      setIsPortalsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Bike className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Delivery Partner</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 md:gap-6">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF523B] to-[#FF8E3B] flex items-center justify-center text-white shadow-md shadow-[#FF523B]/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                    FOOD<span className="text-[#FF523B]">ORA</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-[#FF523B]/15 dark:text-[#FF523B] dark:border dark:border-[#FF523B]/30 rounded-md">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-400 -mt-1 hidden sm:block">
                  Discover • Order • Dine
                </span>
              </div>
            </button>

            {/* Location Selector */}
            <button
              id="location-picker-btn"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-200 text-xs font-medium transition-all max-w-[210px] border border-transparent dark:border-white/10 cursor-pointer group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF523B] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">{location}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl relative hidden md:block"
          >
            <div className="relative">
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (page !== 'search') navigate('search');
                }}
                placeholder="Search for restaurant, cuisine, or a dish..."
                className="w-full pl-11 pr-16 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-transparent dark:border-white/10 focus:border-[#FF523B]/60 focus:bg-white dark:focus:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF523B]/20 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
              <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 dark:text-zinc-400 bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/10 hidden lg:block">
                /
              </kbd>
            </div>
          </form>

          {/* Navigation Links & Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = page === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => navigate(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-orange-50 dark:bg-[#FF523B]/15 text-[#FF523B] font-bold'
                        : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Search Button */}
            <button
              id="mobile-search-btn"
              onClick={() => navigate('search')}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                id="notification-bell-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50">
                  <div className="p-3.5 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                      {unreadNotifs > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-700 dark:bg-[#FF523B]/20 dark:text-[#FF8E3B]">
                          {unreadNotifs} new
                        </span>
                      )}
                    </div>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-[#FF523B] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 dark:text-zinc-500 text-sm">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-start justify-between gap-3 ${
                            !n.read ? 'bg-orange-50/50 dark:bg-[#FF523B]/10' : ''
                          }`}
                        >
                          <div
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.linkPage) navigate(n.linkPage);
                              setIsNotifOpen(false);
                            }}
                            className="cursor-pointer flex-1"
                          >
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-[#FF523B]" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">
                              {n.time}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button with Floating Badge */}
            <button
              id="header-cart-btn"
              onClick={() => navigate('cart')}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-semibold text-xs transition-all shadow-md shadow-[#FF523B]/25 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartTotalCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-[#FF523B] font-bold text-[11px]">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Menu */}
            <div className="relative" ref={userMenuRef}>
              {isLoggedIn ? (
                <button
                  id="user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FF523B]/40"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
                </button>
              ) : (
                <button
                  id="login-trigger-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-[#FF523B] hover:text-[#FF523B] text-xs font-semibold transition-all cursor-pointer dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isLoggedIn && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-[#FF523B]/20 dark:text-[#FF8E3B] text-[10px] font-bold border border-transparent dark:border-[#FF523B]/30">
                      <Sparkles className="w-3 h-3 text-[#FF523B]" /> Foodora Gold Member
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        navigate('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between text-slate-700 dark:text-zinc-200"
                    >
                      <span>My Profile & Orders</span>
                      <ChevronDown className="w-3 h-3 -rotate-90 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between text-slate-700 dark:text-zinc-200"
                    >
                      <span>Saved Addresses</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between text-slate-700 dark:text-zinc-200"
                    >
                      <span>Favorites ❤️</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-white/10 pt-1 text-xs">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
