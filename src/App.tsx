/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { FoodoraProvider, useFoodora } from './context/FoodoraContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { FoodDetailModal } from './components/FoodDetailModal';
import { TableReservationModal } from './components/TableReservationModal';

// Pages
import { HomePage } from './pages/HomePage';
import { RestaurantDiscoveryPage } from './pages/RestaurantDiscoveryPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { OffersDiningPage } from './pages/OffersDiningPage';
import { GlobalSearchPage } from './pages/GlobalSearchPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { RestaurantPartnerDashboardPage } from './pages/RestaurantPartnerDashboardPage';
import { DeliveryPartnerPage } from './pages/DeliveryPartnerPage';

const MainRouter: React.FC = () => {
  const { currentPage } = useFoodora();

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'restaurants':
      case 'delivery':
        return <RestaurantDiscoveryPage />;
      case 'restaurant-detail':
        return <RestaurantDetailPage />;
      case 'cart':
        return <CartCheckoutPage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'profile':
        return <UserProfilePage />;
      case 'dining-offers':
      case 'offers':
      case 'dining':
        return <OffersDiningPage />;
      case 'search':
        return <GlobalSearchPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'restaurant-partner':
        return <RestaurantPartnerDashboardPage />;
      case 'delivery-partner':
        return <DeliveryPartnerPage />;
      default:
        return <HomePage />;
    }
  };

  const isPortalPage =
    currentPage === 'admin' ||
    currentPage === 'restaurant-partner' ||
    currentPage === 'delivery-partner';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] transition-colors duration-200 selection:bg-[#FF523B] selection:text-white">
      {/* Sticky Primary Header */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Global Footer (shown on all customer facing pages) */}
      {!isPortalPage && <Footer />}

      {/* Mobile Navigation bar */}
      <MobileBottomNav />

      {/* Modals and Overlays */}
      <LocationModal />
      <AuthModal />
      <FoodDetailModal />
      <TableReservationModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <FoodoraProvider>
      <MainRouter />
    </FoodoraProvider>
  );
}
