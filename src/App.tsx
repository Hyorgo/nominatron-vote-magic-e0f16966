import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "./hooks/use-mobile";
import BokehEffect from "./components/effects/BokehEffect";
import "./App.css";

function App() {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <BokehEffect />
        {!isMobile && <div className="gold-halo" />}
        {!isMobile && (
          <>
            <div className="fuchsia-halo" />
            <div className="blue-halo" />
          </>
        )}
        <Navigation />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;