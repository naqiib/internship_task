import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingNav from './components/FloatingNav';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Favourites from './pages/Favourites';
import AdminDashboard from './pages/AdminDashboard';
import GuideDashboard from './pages/GuideDashboard';

import './App.css';

function AppLayout() {
  const location = useLocation();
  const hideGlobalChrome = ['/login', '/register', '/admin'].includes(location.pathname);

  return (
    <>
      {!hideGlobalChrome && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/book/:packageId"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide"
            element={
              <ProtectedRoute guideOnly>
                <GuideDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideGlobalChrome && <Footer />}
      {!hideGlobalChrome && <FloatingNav />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="page narrow">
      <h1>Page not found</h1>
      <p className="muted">The page you requested does not exist.</p>
      <Link to="/">Return home</Link>
    </div>
  );
}