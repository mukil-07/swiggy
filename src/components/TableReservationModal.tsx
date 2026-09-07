import React, { useState } from 'react';
import { X, Calendar, Clock, Users, User, Phone, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';

export const TableReservationModal: React.FC = () => {
  const {
    isReservationModalOpen,
    setIsReservationModalOpen,
    selectedRestaurantForReservation,
    createReservation,
    user
  } = useFoodora();

  const restaurant = selectedRestaurantForReservation;

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('7:30 PM');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState(user?.name || 'Alexander Wright');
  const [guestEmail, setGuestEmail] = useState(user?.email || 'alex.wright@foodora.demo');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [specialRequests, setSpecialRequests] = useState('');

  if (!isReservationModalOpen || !restaurant) return null;

  const timeSlots = [
    '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservation(date, timeSlot, guests, guestName, guestEmail, guestPhone, specialRequests);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="table-reservation-modal"
        className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
      >
        <button
          onClick={() => setIsReservationModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Header */}
        <div className="relative h-40 w-full bg-slate-800 shrink-0">
          <img
            src={restaurant.bannerImage || restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8E3B]">
              Table Reservation
            </span>
            <h3 className="text-xl font-black font-['Outfit']">{restaurant.name}</h3>
            <p className="text-xs text-slate-300 line-clamp-1">{restaurant.address}</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF523B]" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs font-medium text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FF523B]" />
                <span>Guests Count</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6, 8].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      guests === num
                        ? 'bg-[#FF523B] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF523B]" />
              <span>Select Time Slot</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    timeSlot === slot
                      ? 'bg-[#FF523B] text-white font-bold shadow-xs'
                      : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-slate-700 dark:text-zinc-300 hover:border-[#FF523B]/50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Details */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Guest Name
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="E.g., Window seat, quiet anniversary corner, high chair for toddler..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF523B] to-[#FF8E3B] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#FF523B]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm Reservation ({guests} Guests • {timeSlot})</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
              Instant confirmation • Free cancellation up to 1 hour prior
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
