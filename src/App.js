import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientLogin from "./Auth/Login";
import PatientSignup from "./Auth/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./Patient/PatientDashboard";
import DoctorDashboard from "./Doctor/DoctorDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import Home from "./DoctorSearch/DoctorSearch";
import AppointmentBooking from "./AppointmentBooking/AppointmentBooking";
import PatientProfile from "./Patient/PatientProfile";
import DoctorProfile from "./Doctor/DoctorProfile";
import AvailabilityScheduler from "./Doctor/AvailabilityScheduler";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Patient Routes */}
        <Route path="login" element={<PatientLogin />} />
        <Route path="register" element={<PatientSignup />} />
        <Route path="/" element={<Home />} />
        <Route path="patient" element={<Dashboard />} />
        <Route
          path="/appointment-booking/:doctorId"
          element={<AppointmentBooking />}
        />

        <Route path="/patient/profile" element={<PatientProfile />} />

        <Route path="/doctor/profile" element={<DoctorProfile />} />
        {/* Doctor Routes */}
        <Route path="doctor" element={<DoctorDashboard />} />
        <Route
          path="/doctor/availability"
          element={<AvailabilityScheduler />}
        />
        <Route path="admin" element={<AdminDashboard />} />

        {/* Admin Routes */}
        {/* <Route path="admin" element={<AdminDashboard />} /> */}

        {/* Fallback Route */}
      </Routes>
    </Router>
  );
};

export default App;
