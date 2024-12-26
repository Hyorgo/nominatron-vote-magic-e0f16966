import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import AdminDashboard from "@/pages/AdminDashboard";
import { Navigation } from "@/components/Navigation";
import { ScrollingText } from "@/components/ScrollingText";

export const Router = () => {
  return (
    <>
      <Navigation />
      <ScrollingText />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};