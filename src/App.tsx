import { Outlet } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Toaster } from "./components/ui/toaster";
import Footer from "./components/Footer";
import { Router } from "./Router";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router />
      <Toaster />
    </div>
  );
}

export default App;