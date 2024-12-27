import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { Navigation } from "./components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "./hooks/use-mobile";
import BokehEffect from "./components/effects/BokehEffect";
import "./App.css";

function App() {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col relative">
        <BokehEffect />
        {!isMobile && (
          <>
            <div className="gold-halo" />
            <div className="fuchsia-halo" />
            <div className="blue-halo" />
          </>
        )}
        <Navigation />
        <Router />
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;