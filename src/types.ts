export type PageType =
  | 'home'
  | 'restaurants'
  | 'restaurant-detail'
  | 'dining-offers'
  | 'cart'
  | 'order-tracking'
  | 'profile'
  | 'search'
  | 'admin'
  | 'restaurant-partner'
  | 'delivery-partner';

export type FoodCategory =
  | 'Recommended'
  | 'Starters'
  | 'Main Course'
  | 'Biryani'
  | 'Pizza'
  | 'Burgers'
  | 'Desserts'
  | 'Beverages'
  | 'Healthy Bowls'
  | 'Asian & Sushi';

export interface FoodCustomizationSize {
  name: string;
  priceDelta: number;
}

export interface FoodAddOn {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  category: FoodCategory;
  description: string;
  price: number;
  originalPrice?: number;
  isVeg: boolean;
  isBestseller?: boolean;
  rating: number;
  ratingCount: number;
  image: string;
  calories?: number;
  prepTimeMinutes?: number;
  ingredients?: string[];
  sizes?: FoodCustomizationSize[];
  addOns?: FoodAddOn[];
  isAvailable: boolean;
}

export interface RestaurantReview {
  id: string;
  restaurantId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  helpfulCount: number;
  recommendedDish?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage: string;
  cuisines: string[];
  rating: number;
  reviewsCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  distanceKm: number;
  priceForTwo: number;
  isVegOnly: boolean;
  isPromoted?: boolean;
  offerBadge?: string;
  deliveryBadge?: string;
  isTrending?: boolean;
  isNewlyOpened?: boolean;
  isOpen: boolean;
  address: string;
  city: string;
  area: string;
  contactNumber: string;
  openingHours: string;
  hygieneScore: string;
  facilities: string[];
  diningAvailable: boolean;
  diningRating: number;
  diningPriceForTwo: number;
  tableReservationAvailable?: boolean;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  quantity: number;
  selectedSize?: FoodCustomizationSize;
  selectedAddOns: FoodAddOn[];
  itemPrice: number; // single unit with size + addons
  totalPrice: number; // itemPrice * quantity
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercent?: number;
  maxDiscount?: number;
  flatDiscount?: number;
  minOrder: number;
  isFreeDelivery?: boolean;
  expiryDate: string;
  bankName?: string;
  category: 'Trending' | 'Flat Discount' | 'Free Delivery' | 'Bank Offer' | 'New User';
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label?: string;
  street: string;
  apartment?: string;
  landmark?: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'card'
  | 'upi'
  | 'wallet'
  | 'cod'
  | 'UPI'
  | 'Credit/Debit Card'
  | 'Cash on Delivery'
  | 'Wallet'
  | 'Net Banking';

export interface DeliveryRider {
  name: string;
  phone: string;
  rating: number;
  avatar: string;
  vehicleNumber: string;
  completedDeliveries: number;
  photo?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantPhone: string;
  restaurantAddress: string;
  items: CartItem[];
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  platformFee: number;
  grandTotal: number;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  rider: DeliveryRider;
  estimatedDeliveryMinutes: number;
  estimatedDeliveryMins?: number;
  couponApplied?: string;
  deliveryInstructions?: string;
  specialInstructions?: string;
  userName?: string;
  timelineUpdates: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
}

export interface TableReservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  timeSlot: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'offer' | 'system' | 'restaurant';
  read: boolean;
  linkPage?: PageType;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  savedAddresses: Address[];
  favoriteRestaurantIds: string[];
  favoriteFoodIds: string[];
  savedPaymentMethods: {
    id: string;
    type: 'card' | 'upi';
    title: string;
    subtitle: string;
  }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message?: string;
}
