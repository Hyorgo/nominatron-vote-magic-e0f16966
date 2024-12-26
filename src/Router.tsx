import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import AdminDashboard from "@/pages/AdminDashboard";
import { Navigation } from "@/components/Navigation";
import { ScrollingText } from "@/components/ScrollingText";
import Categories from "@/pages/Categories";
import Contact from "@/pages/Contact";
import Reserver from "@/pages/Reserver";
import ThankYou from "@/pages/ThankYou";
import PaymentStatus from "@/pages/PaymentStatus";
import LegalNotice from "@/pages/LegalNotice";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Footer from "@/components/Footer";

export const Router = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <ScrollingText />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reserver" element={<Reserver />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/mentions-legales" element={<LegalNotice />} />
          <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};