import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  PageType,
  Restaurant,
  FoodItem,
  CartItem,
  Offer,
  RestaurantReview,
  Address,
  Order,
  UserProfile,
  AppNotification,
  TableReservation,
  ToastMessage,
  FoodCustomizationSize,
  FoodAddOn,
  OrderStatus
} from '../types';
import {
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_OFFERS,
  INITIAL_REVIEWS,
  INITIAL_USER,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface CouponResult {
  success: boolean;
  message: string;
  discount: number;
}

interface FoodoraContextType {
  // Navigation & View
  page: PageType;
  setPage: (page: PageType) => void;
  navigate: (page: PageType, restaurantId?: string, orderId?: string) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  deliveryOrDiningMode: 'delivery' | 'dining';
  setDeliveryOrDiningMode: (mode: 'delivery' | 'dining') => void;

  // Theme & Location
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  location: string;
  setLocation: (loc: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Data & State
  restaurants: Restaurant[];
  foodItems: FoodItem[];
  cart: CartItem[];
  offers: Offer[];
  appliedOffer: Offer | null;
  reviews: RestaurantReview[];
  orders: Order[];
  activeOrder: Order | null;
  reservations: TableReservation[];
  notifications: AppNotification[];
  user: UserProfile;
  isLoggedIn: boolean;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'otp';
  setAuthModalMode: (mode: 'login' | 'signup' | 'otp') => void;
  isFoodModalOpen: boolean;
  setIsFoodModalOpen: (open: boolean) => void;
  selectedFoodForModal: FoodItem | null;
  openFoodDetail: (food: FoodItem) => void;
  isReservationModalOpen: boolean;
  setIsReservationModalOpen: (open: boolean) => void;
  selectedRestaurantForReservation: Restaurant | null;
  openReservationModal: (restaurant: Restaurant) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart Operations
  addToCart: (
    item: FoodItem,
    selectedSize?: FoodCustomizationSize,
    selectedAddOns?: FoodAddOn[],
    quantity?: number
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartRestaurant: Restaurant | null;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;

  // Order & Tracking
  placeOrder: (
    address: Address,
    paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Wallet' | 'Net Banking',
    specialInstructions?: string
  ) => Order;
  trackOrder: (orderId: string) => void;
  reorder: (order: Order) => void;

  // Favorites
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  toggleFavoriteFood: (foodId: string) => void;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  isFoodFavorite: (foodId: string) => boolean;

  // Reservations
  createReservation: (
    date: string,
    timeSlot: string,
    guests: number,
    guestName: string,
    guestEmail: string,
    guestPhone: string,
    specialRequests?: string
  ) => TableReservation | null;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // User & Addresses
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  loginUser: (identifier: string, name?: string) => void;
  logoutUser: () => void;

  // Admin & Partner Controls
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;
  addFoodItem: (food: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOffer: (offer: Omit<Offer, 'id'>) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

const FoodoraContext = createContext<FoodoraContextType | undefined>(undefined);

export const FoodoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [page, setPage] = useState<PageType>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>('rest-1');
  const [deliveryOrDiningMode, setDeliveryOrDiningMode] = useState<'delivery' | 'dining'>('delivery');

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedRestaurantForReservation, setSelectedRestaurantForReservation] = useState<Restaurant | null>(null);

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('foodora_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('foodora_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Location
  const [location, setLocation] = useState<string>(() => {
    return localStorage.getItem('foodora_location') || 'Midtown Food District, Metropolis';
  });

  useEffect(() => {
    localStorage.setItem('foodora_location', location);
  }, [location]);

  // Persistent Data States
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('foodora_restaurants');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('foodora_food_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('foodora_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);

  const [reviews] = useState<RestaurantReview[]>(() => {
    const saved = localStorage.getItem('foodora_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('foodora_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('foodora_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem('foodora_active_order_id') || 'ORD-84920';
  });

  const [reservations, setReservations] = useState<TableReservation[]>(() => {
    const saved = localStorage.getItem('foodora_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('foodora_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('foodora_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('foodora_is_logged_in');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('foodora_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('foodora_food_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('foodora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('foodora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('foodora_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('foodora_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('foodora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('foodora_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('foodora_is_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('foodora_active_order_id', activeOrderId);
    }
  }, [activeOrderId]);

  // Derived Active Order
  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0] || null;

  // Derived Cart Restaurant
  const cartRestaurant = cart.length > 0
    ? restaurants.find(r => r.id === cart[0].foodItem.restaurantId) || null
    : null;

  const cartTotalCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Navigation Helper
  const navigate = (toPage: PageType, restaurantId?: string, orderId?: string) => {
    if (restaurantId) {
      setSelectedRestaurantId(restaurantId);
    }
    if (orderId) {
      setActiveOrderId(orderId);
    }
    setPage(toPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const addToCart = (
    item: FoodItem,
    selectedSize?: FoodCustomizationSize,
    selectedAddOns: FoodAddOn[] = [],
    quantity = 1
  ) => {
    // Check if cart has items from a different restaurant
    if (cart.length > 0 && cart[0].foodItem.restaurantId !== item.restaurantId) {
      const confirmSwitch = window.confirm(
        `Your cart contains items from "${cart[0].foodItem.restaurantName}". Would you like to reset your cart to add items from "${item.restaurantName}"?`
      );
      if (!confirmSwitch) return;
      setCart([]);
    }

    const sizeDelta = selectedSize ? selectedSize.priceDelta : 0;
    const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = item.price + sizeDelta + addOnsTotal;

    // Unique key identifying customization
    const addOnKey = selectedAddOns.map(a => a.id).sort().join('-');
    const cartItemId = `${item.id}-${selectedSize?.name || 'def'}-${addOnKey}`;

    setCart(prev => {
      const existing = prev.find(c => c.cartItemId === cartItemId);
      if (existing) {
        return prev.map(c =>
          c.cartItemId === cartItemId
            ? {
                ...c,
                quantity: c.quantity + quantity,
                totalPrice: (c.quantity + quantity) * unitPrice
              }
            : c
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          foodItem: item,
          quantity,
          selectedSize,
          selectedAddOns,
          itemPrice: unitPrice,
          totalPrice: unitPrice * quantity
        }
      ];
    });

    showToast('Added to cart', `${item.name} (${quantity}x) added to your order`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(c => {
          if (c.cartItemId === cartItemId) {
            const newQty = c.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...c,
              quantity: newQty,
              totalPrice: newQty * c.itemPrice
            };
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(c => c.cartItemId !== cartItemId));
    showToast('Item removed', 'Item was removed from your cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedOffer(null);
  };

  // Coupons
  const applyCoupon = (code: string): CouponResult => {
    const upperCode = code.trim().toUpperCase();
    const offer = offers.find(o => o.code === upperCode);

    if (!offer) {
      return { success: false, message: 'Invalid coupon code. Try WELCOME50 or FOOD10', discount: 0 };
    }

    const subtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

    if (subtotal < offer.minOrder) {
      return {
        success: false,
        message: `Min order for ${upperCode} is $${offer.minOrder}. Add $${(offer.minOrder - subtotal).toFixed(2)} more!`,
        discount: 0
      };
    }

    let calculatedDiscount = 0;
    if (offer.isFreeDelivery) {
      calculatedDiscount = 2.49; // standard delivery
    } else if (offer.flatDiscount) {
      calculatedDiscount = offer.flatDiscount;
    } else if (offer.discountPercent) {
      calculatedDiscount = (subtotal * offer.discountPercent) / 100;
      if (offer.maxDiscount && calculatedDiscount > offer.maxDiscount) {
        calculatedDiscount = offer.maxDiscount;
      }
    }

    setAppliedOffer(offer);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    showToast(`Coupon ${offer.code} applied!`, `You saved $${calculatedDiscount.toFixed(2)}`, 'success');

    return { success: true, message: `Coupon applied: ${offer.title}`, discount: calculatedDiscount };
  };

  const removeCoupon = () => {
    setAppliedOffer(null);
    showToast('Coupon removed', undefined, 'info');
  };

  // Place Order
  const placeOrder = (
    address: Address,
    paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Wallet' | 'Net Banking',
    specialInstructions?: string
  ): Order => {
    const subtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

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
    const grandTotal = +(Math.max(0, subtotal - discount) + deliveryFee + taxes + platformFee).toFixed(2);

    const targetRestaurant = cartRestaurant || restaurants[0];

    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const nowStr = 'Just now';

    const newOrder: Order = {
      id: orderId,
      createdAt: nowStr,
      restaurantId: targetRestaurant.id,
      restaurantName: targetRestaurant.name,
      restaurantImage: targetRestaurant.image,
      restaurantPhone: targetRestaurant.contactNumber,
      restaurantAddress: targetRestaurant.address,
      items: [...cart],
      itemTotal: +subtotal.toFixed(2),
      discount: +discount.toFixed(2),
      deliveryFee,
      taxes,
      platformFee,
      grandTotal,
      status: 'placed',
      deliveryAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      rider: {
        name: 'Liam Vance',
        phone: '+1 (555) 390-4491',
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        vehicleNumber: 'FOODORA-E82',
        completedDeliveries: 1280
      },
      estimatedDeliveryMinutes: 28,
      couponApplied: appliedOffer?.code,
      specialInstructions,
      timelineUpdates: [
        {
          status: 'placed',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Order placed via ${paymentMethod}`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(orderId);
    clearCart();

    // Trigger celebration confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Add notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'Order Placed Successfully! 🛵',
      message: `Order #${orderId} from ${targetRestaurant.name} is being sent to the kitchen.`,
      time: 'Just now',
      type: 'order',
      read: false,
      linkPage: 'order-tracking'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Order confirmed!', `Order #${orderId} placed. Tracking initiated.`, 'success');

    // Automatically simulate realistic order timeline progression for this order
    simulateOrderProgression(orderId);

    return newOrder;
  };

  // Realistic Order Progression Simulator
  const simulateOrderProgression = (orderId: string) => {
    // Step 1: Restaurant Accepted after 7 seconds
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o => {
          if (o.id === orderId && o.status === 'placed') {
            return {
              ...o,
              status: 'accepted',
              timelineUpdates: [
                ...o.timelineUpdates,
                {
                  status: 'accepted',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  description: 'Restaurant has accepted and queued your order'
                }
              ]
            };
          }
          return o;
        })
      );
      showToast('Order Accepted! 👨‍🍳', 'Restaurant has started preparing ingredients.');
    }, 7000);

    // Step 2: Food Being Prepared after 18 seconds
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o => {
          if (o.id === orderId && (o.status === 'placed' || o.status === 'accepted')) {
            return {
              ...o,
              status: 'preparing',
              timelineUpdates: [
                ...o.timelineUpdates,
                {
                  status: 'preparing',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  description: 'Chef is cooking your fresh dishes'
                }
              ]
            };
          }
          return o;
        })
      );
    }, 18000);

    // Step 3: Picked up after 35 seconds
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o => {
          if (o.id === orderId && o.status === 'preparing') {
            return {
              ...o,
              status: 'picked_up',
              timelineUpdates: [
                ...o.timelineUpdates,
                {
                  status: 'picked_up',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  description: `Delivery rider ${o.rider.name} picked up the sealed insulated pack`
                }
              ]
            };
          }
          return o;
        })
      );
      showToast('Food Picked Up! 📦', 'Your delivery partner has secured the package.');
    }, 35000);

    // Step 4: Out for delivery after 50 seconds
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o => {
          if (o.id === orderId && o.status === 'picked_up') {
            return {
              ...o,
              status: 'out_for_delivery',
              timelineUpdates: [
                ...o.timelineUpdates,
                {
                  status: 'out_for_delivery',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  description: 'Rider is on the way to your delivery address'
                }
              ]
            };
          }
          return o;
        })
      );
    }, 50000);
  };

  const trackOrder = (orderId: string) => {
    setActiveOrderId(orderId);
    navigate('order-tracking', undefined, orderId);
  };

  const reorder = (order: Order) => {
    clearCart();
    order.items.forEach(it => {
      addToCart(it.foodItem, it.selectedSize, it.selectedAddOns, it.quantity);
    });
    navigate('cart');
    showToast('Items added to cart', `Added items from ${order.restaurantName}`, 'success');
  };

  // Favorites
  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setUser(prev => {
      const isFav = prev.favoriteRestaurantIds.includes(restaurantId);
      const updated = isFav
        ? prev.favoriteRestaurantIds.filter(id => id !== restaurantId)
        : [...prev.favoriteRestaurantIds, restaurantId];
      return { ...prev, favoriteRestaurantIds: updated };
    });
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const isNowFav = !user.favoriteRestaurantIds.includes(restaurantId);
    showToast(
      isNowFav ? 'Saved to Favorites ❤️' : 'Removed from Favorites',
      restaurant?.name,
      'info'
    );
  };

  const toggleFavoriteFood = (foodId: string) => {
    setUser(prev => {
      const isFav = prev.favoriteFoodIds.includes(foodId);
      const updated = isFav
        ? prev.favoriteFoodIds.filter(id => id !== foodId)
        : [...prev.favoriteFoodIds, foodId];
      return { ...prev, favoriteFoodIds: updated };
    });
    const food = foodItems.find(f => f.id === foodId);
    const isNowFav = !user.favoriteFoodIds.includes(foodId);
    showToast(
      isNowFav ? 'Dish Saved to Favorites ❤️' : 'Removed from Favorites',
      food?.name,
      'info'
    );
  };

  const isRestaurantFavorite = (id: string) => user.favoriteRestaurantIds.includes(id);
  const isFoodFavorite = (id: string) => user.favoriteFoodIds.includes(id);

  // Table Reservation
  const openReservationModal = (restaurant: Restaurant) => {
    setSelectedRestaurantForReservation(restaurant);
    setIsReservationModalOpen(true);
  };

  const createReservation = (
    date: string,
    timeSlot: string,
    guests: number,
    guestName: string,
    guestEmail: string,
    guestPhone: string,
    specialRequests?: string
  ): TableReservation | null => {
    if (!selectedRestaurantForReservation) return null;

    const reservation: TableReservation = {
      id: 'RES-' + Math.floor(1000 + Math.random() * 9000),
      restaurantId: selectedRestaurantForReservation.id,
      restaurantName: selectedRestaurantForReservation.name,
      restaurantImage: selectedRestaurantForReservation.image,
      date,
      timeSlot,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      status: 'confirmed',
      createdAt: 'Just now'
    };

    setReservations(prev => [reservation, ...prev]);
    setIsReservationModalOpen(false);

    confetti({ particleCount: 70, spread: 60 });
    showToast(
      'Table Reserved Successfully! 🥂',
      `Booking for ${guests} guests at ${selectedRestaurantForReservation.name} confirmed.`,
      'success'
    );

    return reservation;
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', undefined, 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Profile & Addresses
  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
    showToast('Profile updated', 'Your profile changes have been saved', 'success');
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addr,
      id: 'addr-' + Date.now()
    };
    setUser(prev => ({
      ...prev,
      savedAddresses: [newAddress, ...prev.savedAddresses]
    }));
    showToast('Address saved', `${newAddress.type} address added successfully`, 'success');
  };

  const deleteAddress = (id: string) => {
    setUser(prev => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter(a => a.id !== id)
    }));
    showToast('Address removed', undefined, 'info');
  };

  // Auth
  const loginUser = (identifier: string, name = 'Alexander Wright') => {
    setIsLoggedIn(true);
    setUser(prev => ({
      ...prev,
      name,
      email: identifier.includes('@') ? identifier : prev.email,
      phone: !identifier.includes('@') ? identifier : prev.phone
    }));
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${name}! 👋`, 'You are now signed in to FOODORA', 'success');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    showToast('Signed out', 'You have been safely logged out', 'info');
  };

  // Food Item Modal
  const openFoodDetail = (food: FoodItem) => {
    setSelectedFoodForModal(food);
    setIsFoodModalOpen(true);
  };

  // Admin & Partner Controls
  const addRestaurant = (newRest: Omit<Restaurant, 'id'>) => {
    const id = 'rest-' + (restaurants.length + 1);
    const completeRest: Restaurant = { ...newRest, id };
    setRestaurants(prev => [completeRest, ...prev]);
    showToast('Restaurant listed!', `${completeRest.name} is now live on Foodora`, 'success');
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
    showToast('Restaurant updated', undefined, 'success');
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
    showToast('Restaurant deleted', undefined, 'info');
  };

  const toggleFoodAvailability = (id: string) => {
    setFoodItems(prev =>
      prev.map(f => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f))
    );
    const item = foodItems.find(f => f.id === id);
    showToast(
      'Availability updated',
      `${item?.name} is now ${item?.isAvailable ? 'Out of Stock' : 'In Stock'}`
    );
  };

  const addFoodItem = (food: Omit<FoodItem, 'id'>) => {
    const id = 'food-' + (foodItems.length + 101);
    const newItem: FoodItem = { ...food, id };
    setFoodItems(prev => [newItem, ...prev]);
    showToast('New dish added!', `${newItem.name} added to menu`, 'success');
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
    showToast('Dish updated', undefined, 'success');
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(f => f.id !== id));
    showToast('Dish removed from menu', undefined, 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const statusDescMap: Record<OrderStatus, string> = {
            placed: 'Order confirmed and paid',
            accepted: 'Restaurant acknowledged order',
            confirmed: 'Kitchen confirmed order ticket',
            preparing: 'Dishes being cooked by chef',
            picked_up: `Package picked up by rider ${o.rider.name}`,
            out_for_delivery: 'Rider is en route to destination',
            delivered: 'Order handed over successfully',
            cancelled: 'Order was cancelled'
          };
          return {
            ...o,
            status,
            timelineUpdates: [
              ...o.timelineUpdates,
              {
                status,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                description: statusDescMap[status]
              }
            ]
          };
        }
        return o;
      })
    );
    showToast('Order status updated', `Order #${orderId} marked as ${status.replace('_', ' ')}`, 'info');
  };

  const createOffer = (offer: Omit<Offer, 'id'>) => {
    const id = 'off-' + (offers.length + 1);
    const newOff: Offer = { ...offer, id };
    setOffers(prev => [newOff, ...prev]);
    showToast('Offer created!', `Coupon ${newOff.code} is now active`, 'success');
  };

  return (
    <FoodoraContext.Provider
      value={{
        page,
        setPage,
        navigate,
        selectedRestaurantId,
        setSelectedRestaurantId,
        deliveryOrDiningMode,
        setDeliveryOrDiningMode,
        theme,
        toggleTheme,
        location,
        setLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        restaurants,
        foodItems,
        cart,
        offers,
        appliedOffer,
        reviews,
        orders,
        activeOrder,
        reservations,
        notifications,
        user,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isFoodModalOpen,
        setIsFoodModalOpen,
        selectedFoodForModal,
        openFoodDetail,
        isReservationModalOpen,
        setIsReservationModalOpen,
        selectedRestaurantForReservation,
        openReservationModal,
        searchQuery,
        setSearchQuery,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartRestaurant,
        applyCoupon,
        removeCoupon,
        placeOrder,
        trackOrder,
        reorder,
        toggleFavoriteRestaurant,
        toggleFavoriteFood,
        isRestaurantFavorite,
        isFoodFavorite,
        createReservation,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        updateUserProfile,
        addAddress,
        deleteAddress,
        loginUser,
        logoutUser,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        toggleFoodAvailability,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        updateOrderStatus,
        createOffer,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </FoodoraContext.Provider>
  );
};

export const useFoodora = () => {
  const context = useContext(FoodoraContext);
  if (!context) {
    throw new Error('useFoodora must be used within a FoodoraProvider');
  }
  return context;
};
