import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristDashboard from './pages/TouristDashboard';
import GovernanceDashboard from './pages/GovernanceDashboard';
import AdminEvents from './pages/AdminEvents';
import TouristEvents from './pages/TouristEvents';
import AdminPrograms from './pages/AdminPrograms';
import TouristPrograms from './pages/TouristPrograms';
import AdminDashboard from './pages/AdminDashboard';
import MainDashboard from './pages/MainDashboard';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/events" element={<TouristEvents />} />
        <Route path="/programs" element={<TouristPrograms />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/dashboard" element={<TouristDashboard />} />
        <Route path="/GovernanceDashboard" element={<GovernanceDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* NEW UNIFIED ROUTES */}
        <Route path="/main-dashboard" element={<ProtectedRoute><DashboardLayout><MainDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'COMPLIANCE', 'AUDITOR', 'OFFICER']}><DashboardLayout><ReportsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;