import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Reserver from "./pages/Reserver";
import Contact from "./pages/Contact";

const Footer = () => (
  <footer className="footer-glass py-6 mt-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-sm text-muted-foreground">
          © 2024 Lyon d'Or. Tous droits réservés.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Mentions légales
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Politique de confidentialité
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            CGV
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reserver" element={<Reserver />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;