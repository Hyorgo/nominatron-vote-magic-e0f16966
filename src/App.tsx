import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ScrollingText } from "@/components/ScrollingText";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Categories from "@/pages/Categories";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import ThankYou from "@/pages/ThankYou";
import Reserver from "@/pages/Reserver";
import PaymentStatus from "@/pages/PaymentStatus";
import LegalNotice from "@/pages/LegalNotice";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/reserver" element={<Reserver />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/mentions-legales" element={<LegalNotice />} />
            <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <ScrollingText />
        <Footer />
      </div>
    </Router>
  );
}

export default App;