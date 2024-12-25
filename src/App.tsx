import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Categories from "@/pages/Categories";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import ThankYou from "@/pages/ThankYou";
import Reserver from "@/pages/Reserver";
import PaymentStatus from "@/pages/PaymentStatus";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/reserver" element={<Reserver />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
      </Routes>
    </Router>
  );
}

export default App;