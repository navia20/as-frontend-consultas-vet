import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterForm";
import AdminDashboard from "./components/Dashboard/Admin/AdminDashboard";
import ClientDashboard from "./components/Dashboard/Cliente/ClientDashboard";
import ReservationForm from "./components/Reservations/ReservationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/reservation" element={<ReservationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
