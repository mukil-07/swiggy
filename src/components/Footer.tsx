import React from 'react';
import {
  UtensilsCrossed,
  ShieldCheck,
  Smartphone,
  Globe,
  Heart,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Bike,
  Store,
  ShieldAlert
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';

export const Footer: React.FC = () => {
  const { navigate } = useFoodora();

  return (
    <footer className="bg-slate-950 dark:bg-[#080808] text-slate-300 dark:text-zinc-400 pt-16 pb-24 md:pb-12 border-t border-slate-800 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top brand row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-10 border-b border-slate-800 dark:border-white/10 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF523B] to-[#FF8E3B] flex items-center justify-center text-white shadow-md shadow-[#FF523B]/20">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                FOOD<span className="text-[#FF523B]">ORA</span>
              </span>
              <p className="text-xs text-slate-400 dark:text-zinc-400">
                Premium Food Discovery, Gourmet Delivery & Table Reservations
              </p>
            </div>
          </div>

          {/* Quick Portal Switch Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => navigate('admin')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-white/5 hover:bg-slate-700 dark:hover:bg-white/10 text-purple-300 flex items-center gap-1.5 transition-colors border border-purple-500/20 dark:border-white/10"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => navigate('restaurant-partner')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-white/5 hover:bg-slate-700 dark:hover:bg-white/10 text-blue-300 flex items-center gap-1.5 transition-colors border border-blue-500/20 dark:border-white/10"
            >
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Restaurant Partner</span>
            </button>
            <button
              onClick={() => navigate('delivery-partner')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-white/5 hover:bg-slate-700 dark:hover:bg-white/10 text-emerald-300 flex items-center gap-1.5 transition-colors border border-emerald-500/20 dark:border-white/10"
            >
              <Bike className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rider Interface</span>
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 text-xs">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs font-['Outfit']">
              About Foodora
            </h4>
            <ul className="space-y-2.5 text-slate-400 dark:text-zinc-400">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Who We Are</a></li>
              <li><a href="#blog" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Foodora Culinary Blog</a></li>
              <li><a href="#careers" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Careers & Team</a></li>
              <li><a href="#press" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Press & Newsroom</a></li>
              <li><a href="#impact" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Eco Delivery Promise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs font-['Outfit']">
              For Foodies
            </h4>
            <ul className="space-y-2.5 text-slate-400 dark:text-zinc-400">
              <li><button onClick={() => navigate('restaurants')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Top Rated Kitchens</button></li>
              <li><button onClick={() => navigate('dining-offers')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Dining Table Booking</button></li>
              <li><button onClick={() => navigate('dining-offers')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Exclusive Promocodes</button></li>
              <li><button onClick={() => navigate('cart')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Foodora Plus Pass</button></li>
              <li><button onClick={() => navigate('profile')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Community Reviews</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs font-['Outfit']">
              For Restaurants
            </h4>
            <ul className="space-y-2.5 text-slate-400 dark:text-zinc-400">
              <li><button onClick={() => navigate('restaurant-partner')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Partner With Us</button></li>
              <li><button onClick={() => navigate('restaurant-partner')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Restaurant Dashboard</button></li>
              <li><a href="#pos" onClick={(e) => { e.preventDefault(); navigate('restaurant-partner'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Smart Kitchen POS</a></li>
              <li><a href="#growth" onClick={(e) => { e.preventDefault(); navigate('restaurant-partner'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Growth & Marketing</a></li>
              <li><a href="#hygiene" onClick={(e) => { e.preventDefault(); navigate('restaurant-partner'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Food Safety Standards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs font-['Outfit']">
              For Riders
            </h4>
            <ul className="space-y-2.5 text-slate-400 dark:text-zinc-400">
              <li><button onClick={() => navigate('delivery-partner')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Become a Rider Partner</button></li>
              <li><button onClick={() => navigate('delivery-partner')} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Live Delivery Portal</button></li>
              <li><a href="#earnings" onClick={(e) => { e.preventDefault(); navigate('delivery-partner'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Flexible Earnings & Perks</a></li>
              <li><a href="#insurance" onClick={(e) => { e.preventDefault(); navigate('delivery-partner'); }} className="hover:text-white dark:hover:text-[#FF8E3B] transition-colors">Health & Accident Cover</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs font-['Outfit']">
              Experience the App
            </h4>
            <p className="text-slate-400 dark:text-zinc-400 text-xs mb-3">
              Order anywhere with ultra-fast live tracking on iOS & Android.
            </p>
            <div className="space-y-2">
              <div className="px-3 py-2 rounded-xl bg-slate-800 dark:bg-white/5 hover:bg-slate-700 dark:hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors border border-slate-700 dark:border-white/10">
                <Smartphone className="w-5 h-5 text-[#FF523B]" />
                <div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-400 uppercase">Download on the</div>
                  <div className="text-xs font-bold text-white">Apple App Store</div>
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-800 dark:bg-white/5 hover:bg-slate-700 dark:hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors border border-slate-700 dark:border-white/10">
                <Globe className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-400 uppercase">Get it on</div>
                  <div className="text-xs font-bold text-white">Google Play Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 dark:border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-zinc-500 gap-4">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} FOODORA Technologies Inc. Crafted with{' '}
            <Heart className="w-3.5 h-3.5 text-[#FF523B] inline fill-current" /> for food lovers everywhere.
          </p>

          <div className="flex items-center gap-4">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 dark:hover:text-zinc-300">Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 dark:hover:text-zinc-300">Terms of Service</a>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 dark:hover:text-zinc-300">Security</a>
            <div className="flex items-center gap-3 ml-2 text-slate-400 dark:text-zinc-400">
              <Instagram className="w-4 h-4 hover:text-[#FF523B] cursor-pointer transition-colors" />
              <Twitter className="w-4 h-4 hover:text-[#FF523B] cursor-pointer transition-colors" />
              <Facebook className="w-4 h-4 hover:text-[#FF523B] cursor-pointer transition-colors" />
              <Linkedin className="w-4 h-4 hover:text-[#FF523B] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
