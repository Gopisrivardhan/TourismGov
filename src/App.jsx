import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPrograms from './modules/Program_Resource/AdminPrograms';
import TouristPrograms from './modules/Program_Resource/TouristPrograms';
import AdminDashboard from './modules/Admin/AdminDashboard';
import TouristDashboard from './modules/TouristRegistration_Management/TouristDashboard';
import OfficerDashboard from './modules/TouristRegistration_Management/OfficerDashboard';
import CompleteProfile from './modules/TouristRegistration_Management/CompleteProfile';
import AdminEvents from './modules/Events_Booking/AdminEvents';
import TouristEvents from './modules/Events_Booking/TouristEvents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/events" element={<TouristEvents />} />
        <Route path="/programs" element={<TouristPrograms />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/dashboard" element={<TouristDashboard />} />
        <Route path="/tourist-details" element={<OfficerDashboard />} />
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;