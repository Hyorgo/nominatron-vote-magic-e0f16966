import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "@/pages/Index";
import Categories from "@/pages/Categories";
import ThankYou from "@/pages/ThankYou";
import Reserver from "@/pages/Reserver";
import { ScrollingText } from "@/components/ScrollingText";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/reserver" element={<Reserver />} />
          </Routes>
        </main>
        <ScrollingText />
      </div>
    </Router>
  );
}

export default App;