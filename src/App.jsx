import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PackageDetails from './pages/PackageDetails';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import AddPackage from './pages/AddPackage';
import UpdatePackage from './pages/UpdatePackage';
import Footer from './components/Footer';
import Blog from "./components/Blog";
import PaymentServerDown from './pages/PaymentServerDown';
import CheckoutPage from './pages/CheckoutPage';
import OTPVerify from './pages/OTPVerify';

function Layout() {
  const location = useLocation();
  const noFooterRoutes = ['/login', '/register', '/packages', '/blogs', '/packages:id', '/verify-otp'];
  const noNavbarFooterRoutes = ['/payment-server-down', '/verify-otp'];

  const showNavbar = !noNavbarFooterRoutes.includes(location.pathname);
  const showFooter = !noFooterRoutes.includes(location.pathname) && !noNavbarFooterRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/add-package" element={<AddPackage />} />
        <Route path="/update-package/:id" element={<UpdatePackage />} />
        <Route path="/verify-otp" element={<OTPVerify/>}/>
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/payment-server-down" element={<PaymentServerDown />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />

      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;
