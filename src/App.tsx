import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ScrollingText } from "./components/ScrollingText";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Reserver from "./pages/Reserver";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="gold-halo" />
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reserver" element={<Reserver />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <ScrollingText />
      <div className="footer-glass py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 Tous droits réservés
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;