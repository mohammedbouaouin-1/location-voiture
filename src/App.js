import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import SplashScreen from './components/SplashScreen';

import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Booking from './pages/Booking';
import Login from './pages/Login';
import WhyChooseUs from './pages/WhyChooseUs';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import BookingSuccess from './pages/BookingSuccess';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import WhatsAppButton from './components/WhatsAppButton';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F9FAFB]">
      <h2 className="text-3xl font-black text-[#111827] mb-4">Oups ! Quelque chose s'est mal passé.</h2>
      <p className="text-[#6B7280] mb-8 max-w-md">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-8 py-4 bg-[#111827] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-black/10"
      >
        Réessayer
      </button>
    </div>
  );
}

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/WhyChooseUs" element={<WhyChooseUs />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route 
            path="/booking/:id" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuthPage = location.pathname === '/login';
  const hideNavAndFooter = isDashboard || isAuthPage;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <ScrollProgress />
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      {!hideNavAndFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
    return !sessionStorage.getItem('locafes_splash_shown');
  });

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('locafes_splash_shown', 'true');
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
