import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Index } from "@/pages/Index";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import Categories from "@/pages/Categories";
import Contact from "@/pages/Contact";
import Reserver from "@/pages/Reserver";
import ThankYou from "@/pages/ThankYou";
import PaymentStatus from "@/pages/PaymentStatus";
import LegalNotice from "@/pages/LegalNotice";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/NotFound";
import { ScrollingText } from "@/components/ScrollingText";
import { Footer } from "@/components/Footer";
import BackgroundHalos from "@/components/effects/BackgroundHalos";
import { Navigation } from "@/components/Navigation";

export const Router = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Grain Effect */}
      <div className="fixed inset-0 opacity-20 z-[-2] pointer-events-none">
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-50" />
      </div>
      
      {/* Halos */}
      <BackgroundHalos />
      
      {/* Navigation - Hidden for admin routes */}
      {!isAdminRoute && <Navigation />}
      
      <ScrollingText />
      <main className="flex-grow relative z-[1]">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reserver" element={<Reserver />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/mentions-legales" element={<LegalNotice />} />
          <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};