import React from 'react';
import { Home, Compass, ShoppingBag, Clock, User } from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { PageType } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { page, navigate, cartTotalCount } = useFoodora();

  const navs: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'restaurants', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'profile', label: 'Orders', icon: <Clock className="w-5 h-5" /> },
    { id: 'profile', label: 'Account', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navs.map((item, idx) => {
          const isActive = idx === 4 ? page === 'profile' : page === item.id;
          const isCart = item.id === 'cart';

          return (
            <button
              key={idx}
              id={`mobile-nav-${item.label.toLowerCase()}`}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-[#FF523B] font-bold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isCart && cartTotalCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#FF523B] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
