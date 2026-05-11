import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristDashboard from './pages/TouristDashboard';
import GovernanceDashboard from './pages/GovernanceDashboard';
import AdminEvents from './pages/AdminEvents';
import TouristEvents from './pages/TouristEvents';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<TouristDashboard />} />
        <Route path="/GovernanceDashboard" element={<GovernanceDashboard />} />
        <Route path="/admin" element={<AdminEvents />} />
        <Route path="/tourist" element={<TouristEvents />} />
      </Routes>
    </Router>
  );
}

export default App;