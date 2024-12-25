import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import Reserver from "./pages/Reserver";
import ThankYou from "./pages/ThankYou";
import AdminDashboard from "./pages/AdminDashboard";
import { ScrollingText } from "./components/ScrollingText";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reserver" element={<Reserver />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <ScrollingText />
        <Footer />
      </div>
    </Router>
  );
};

export default App;