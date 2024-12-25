import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import AdminDashboard from "./pages/AdminDashboard";
import ThankYou from "./pages/ThankYou";
import Reserver from "./pages/Reserver";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/reserver" element={<Reserver />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;