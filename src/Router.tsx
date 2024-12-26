import { Routes, Route } from "react-router-dom";
import AdminDashboard from "@/pages/AdminDashboard";

export const Router = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};