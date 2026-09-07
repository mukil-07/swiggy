import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  MapPin,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';
import { PaymentMethod, Address } from '../types';

export const CartCheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotalCount,
    cartRestaurant,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedOffer,
    applyCoupon,
    removeCoupon,
    user,
    addAddress,
    placeOrder,
    navigate,
    offers,
    showToast
  } = useFoodora();

  const [couponInput, setCouponInput] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('Credit/Debit Card');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.savedAddresses[0]?.id || ''
  );
  const [tipAmount, setTipAmount] = useState<number>(2);
  const [instructions, setInstructions] = useState('');

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Metropolis');

  const [isPlacing, setIsPlacing] = useState(false);

  // Subtotal calculation
  const subtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Discount calculation
  let discount = 0;
  if (appliedOffer) {
    if (appliedOffer.isFreeDelivery) {
      discount = 2.49;
    } else if (appliedOffer.flatDiscount) {
      discount = appliedOffer.flatDiscount;
    } else if (appliedOffer.discountPercent) {
      discount = (subtotal * appliedOffer.discountPercent) / 100;
      if (appliedOffer.maxDiscount && discount > appliedOffer.maxDiscount) {
        discount = appliedOffer.maxDiscount;
      }
    }
  }

  const deliveryFee = appliedOffer?.isFreeDelivery || subtotal > 35 ? 0 : 2.49;
  const taxes = +(subtotal * 0.08).toFixed(2);
  const platformFee = 0.99;
  const grandTotal = +(
    Math.max(0, subtotal - discount) +
    deliveryFee +
    taxes +
    platformFee +
    tipAmount
  ).toFixed(2);

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-[#FF523B]/10 text-[#FF523B] flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
          Your Foodora Cart is Empty
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mt-1 mb-6 leading-relaxed">
          Good food is always cooking! Explore our curated kitchens and add your favorite dishes to begin your order.
        </p>
        <button
          onClick={() => navigate('restaurants')}
          className="px-6 py-3 rounded-2xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-xs shadow-lg shadow-[#FF523B]/25 transition-all cursor-pointer"
        >
          Explore Delicious Kitchens
        </button>
      </div>
    );
  }

  const handleApplyCustomCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
    setCouponInput('');
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) return;
    addAddress({
      type: newAddrType,
      street: newAddrStreet,
      city: newAddrCity || 'Metropolis',
      postalCode: '10001',
      phone: user.phone,
      isDefault: false
    });
    setIsAddingAddress(false);
    setNewAddrStreet('');
  };

  const activeAddress =
    user.savedAddresses.find(a => a.id === selectedAddressId) || user.savedAddresses[0];

  const handlePlaceOrderClick = () => {
    if (!activeAddress) {
      showToast('Delivery Address Needed', 'Please add or select a delivery address', 'warning');
      return;
    }

    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      const placed = placeOrder(
        activeAddress,
        selectedPayment as any,
        instructions
      );
      navigate('order-tracking', undefined, placed.id);
    }, 600);
  };

  return (
    <div id="cart-checkout-page" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            Checkout & Finalize Order
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Review your basket items, choose delivery address, and proceed to secure payment.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Empty Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Items, Address, Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Basket Items List */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FF523B]" />
                <span>Order Items ({cartTotalCount})</span>
              </h3>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                From: {cartRestaurant?.name || cart[0]?.foodItem.restaurantName}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/10">
              {cart.map(item => (
                <div key={item.cartItemId} className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-xs border flex items-center justify-center shrink-0 ${
                            item.foodItem.isVeg ? 'border-emerald-600' : 'border-red-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.foodItem.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          />
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.foodItem.name}
                        </h4>
                      </div>

                      {/* Customization Details */}
                      {(item.selectedSize || item.selectedAddOns.length > 0) && (
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                          {item.selectedSize && <span>Portion: {item.selectedSize.name}</span>}
                          {item.selectedAddOns.length > 0 && (
                            <span>
                              {' • '}Add-ons: {item.selectedAddOns.map(a => a.name).join(', ')}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-xs font-black text-slate-900 dark:text-white mt-1">
                        ${(item.itemPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-700 dark:text-zinc-200 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-700 dark:text-zinc-200 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                Special Delivery / Kitchen Instructions
              </label>
              <input
                type="text"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="E.g. Please leave at door, don't ring the bell, extra spicy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Delivery Address Selector */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF523B]" />
                <span>Delivery Address</span>
              </h3>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-bold text-[#FF523B] hover:underline cursor-pointer"
              >
                {isAddingAddress ? 'Cancel' : '+ Add New Address'}
              </button>
            </div>

            {/* Inline Add Address Form */}
            {isAddingAddress && (
              <form
                onSubmit={handleSaveNewAddress}
                className="p-4 rounded-2xl bg-orange-50/50 dark:bg-[#1A1A1A] border border-orange-200 dark:border-white/10 mb-4 space-y-3"
              >
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddrType(lbl)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        newAddrType === lbl
                          ? 'bg-[#FF523B] text-white'
                          : 'bg-white dark:bg-[#121212] text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={newAddrStreet}
                  onChange={e => setNewAddrStreet(e.target.value)}
                  placeholder="Street address / apartment / suite"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                />
                <input
                  type="text"
                  value={newAddrCity}
                  onChange={e => setNewAddrCity(e.target.value)}
                  placeholder="City / Area (e.g. Midtown Metropolis)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF523B] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save & Use Address
                </button>
              </form>
            )}

            {/* Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.savedAddresses.map(addr => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#FF523B] bg-orange-50/40 dark:bg-[#FF523B]/10 ring-2 ring-[#FF523B]/20'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {addr.type}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF523B]" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2">
                      {addr.street}, {addr.city}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Payment Method Selector */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#FF523B]" />
              <span>Select Payment Method</span>
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'Credit/Debit Card' as PaymentMethod,
                  title: 'Credit / Debit Card',
                  subtitle: 'Visa, MasterCard, Amex (Instant 256-bit SSL encrypted)'
                },
                {
                  id: 'UPI' as PaymentMethod,
                  title: 'UPI / Instant QR',
                  subtitle: 'Google Pay, PhonePe, Paytm or any UPI ID'
                },
                {
                  id: 'Wallet' as PaymentMethod,
                  title: 'Foodora Balance / Digital Wallet',
                  subtitle: 'Available balance: $45.00'
                },
                {
                  id: 'Cash on Delivery' as PaymentMethod,
                  title: 'Cash on Delivery',
                  subtitle: 'Pay with cash or scan delivery QR code at doorstep'
                }
              ].map(opt => {
                const isSelected = selectedPayment === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedPayment(opt.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#FF523B] bg-orange-50/40 dark:bg-[#FF523B]/10'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#FF523B]' : 'border-slate-300 dark:border-white/20'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF523B]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {opt.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                          {opt.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Coupon, Tip, Bill Breakdown, Checkout CTA */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          {/* Coupon Code Card */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3 font-['Outfit'] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#FF523B]" />
              <span>Offers & Promocodes</span>
            </h3>

            {appliedOffer ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                    '{appliedOffer.code}' Applied!
                  </span>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    You saved ${discount.toFixed(2)} with this coupon
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCustomCoupon} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-xs font-mono uppercase text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-[#FF523B] dark:hover:bg-[#FF523B] dark:hover:text-white transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Quick 1-click coupon chips */}
            {!appliedOffer && (
              <div className="space-y-1.5 pt-2">
                {offers.slice(0, 3).map(off => (
                  <div
                    key={off.id}
                    onClick={() => applyCoupon(off.code)}
                    className="p-2 rounded-xl border border-dashed border-slate-200 dark:border-white/10 hover:border-[#FF523B] dark:hover:border-[#FF523B] flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#FF523B]">
                        {off.code}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 ml-2">{off.title}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#FF523B]">
                      Tap to Apply
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Partner Tip */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#FF523B]" />
                <span>Tip your delivery partner</span>
              </span>
              {tipAmount > 0 && (
                <span className="text-xs font-bold text-emerald-600">+${tipAmount.toFixed(2)}</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3">
              100% of the tip goes directly to your rider.
            </p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[0, 1, 2, 3].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTipAmount(val)}
                  className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    tipAmount === val
                      ? 'bg-[#FF523B] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-transparent dark:border-white/5'
                  }`}
                >
                  {val === 0 ? 'None' : `$${val}`}
                </button>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit'] pb-2 border-b border-slate-100 dark:border-white/10">
              Bill Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Govt. Taxes & Restaurant Packaging</span>
                <span>${taxes.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Convenience Fee</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>

              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>Rider Tip</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Grand Total
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500">Inclusive of all taxes</span>
              </div>
              <span className="text-2xl font-black text-slate-950 dark:text-white font-['Outfit']">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Place Order CTA */}
            <button
              id="place-order-btn"
              onClick={handlePlaceOrderClick}
              disabled={isPlacing}
              className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-[#FF523B] via-[#ff462e] to-[#FF8E3B] hover:opacity-95 text-white font-black text-sm tracking-wide shadow-xl shadow-[#FF523B]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
            >
              {isPlacing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>PAY ${grandTotal.toFixed(2)} & PLACE ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
