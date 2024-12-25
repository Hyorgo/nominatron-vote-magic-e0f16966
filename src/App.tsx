import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "@/pages/Index";
import Categories from "@/pages/Categories";
import ThankYou from "@/pages/ThankYou";
import { ScrollingText } from "@/components/ScrollingText";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <ScrollingText />
    </Router>
  );
}

export default App;