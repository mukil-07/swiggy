import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Check, Sparkles } from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { POPULAR_LOCATIONS } from '../data/mockData';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    location,
    setLocation,
    showToast
  } = useFoodora();

  const [inputVal, setInputVal] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleSelectLocation = (loc: string) => {
    setLocation(loc);
    setIsLocationModalOpen(false);
    showToast('Location updated', `Serving restaurants in ${loc.split(',')[0]}`, 'info');
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetecting(false);
          const detected = 'Midtown Food District, Metropolis';
          setLocation(detected);
          setIsLocationModalOpen(false);
          showToast('Location detected! 📍', `Found your neighborhood: ${detected}`, 'success');
        },
        (err) => {
          setIsDetecting(false);
          // Graceful fallback to default metropolis
          const detected = 'Downtown Central, Metropolis';
          setLocation(detected);
          setIsLocationModalOpen(false);
          showToast('GPS detected fallback', detected, 'info');
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetecting(false);
      setLocation('Downtown Central, Metropolis');
      setIsLocationModalOpen(false);
    }
  };

  const filteredLocations = POPULAR_LOCATIONS.filter(l =>
    l.toLowerCase().includes(inputVal.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="location-modal"
        className="relative w-full max-w-md bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 overflow-hidden"
      >
        <button
          onClick={() => setIsLocationModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-[#FF523B]" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
            Select Your Location
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5">
          See restaurants and estimated delivery times near you.
        </p>

        {/* GPS Detect Button */}
        <button
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="w-full flex items-center justify-between p-3.5 mb-4 rounded-2xl bg-orange-50 dark:bg-[#FF523B]/10 border border-orange-200 dark:border-[#FF523B]/20 text-orange-700 dark:text-[#FF8E3B] font-bold text-xs hover:bg-orange-100 dark:hover:bg-[#FF523B]/15 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF523B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-left">
              <div>{isDetecting ? 'Detecting current position...' : 'Detect current location'}</div>
              <div className="text-[10px] text-[#FF523B]/80 dark:text-[#FF8E3B]/80 font-normal">
                Using device GPS
              </div>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-[#FF523B]" />
        </button>

        {/* Search location */}
        <div className="relative mb-4">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search for city, street, or area..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-slate-200 dark:border-white/10 focus:border-[#FF523B] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Popular Locations */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2 font-['Outfit']">
            Popular Delivery Zones
          </span>
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {filteredLocations.map((loc, idx) => {
              const isCurrent = location === loc;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 dark:bg-white/5 font-bold text-[#FF523B]'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{loc}</span>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-[#FF523B] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
