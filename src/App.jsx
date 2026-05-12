import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar';

// --- PAGES ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import ReportPage from './pages/ReportPage';
import NotificationsPage from './pages/NotificationsPage'; // NEW: Module 8
import TouristDashboard from './pages/TouristDashboard';
import GovernanceDashboard from './pages/GovernanceDashboard';
import AdminEvents from './pages/AdminEvents';
import TouristEvents from './pages/TouristEvents';
import AdminPrograms from './pages/AdminPrograms';
import TouristPrograms from './pages/TouristPrograms';
import AdminDashboard from './pages/AdminDashboard';
import AdminHeritageSites from './pages/AdminSite';
import MainDashboard from './pages/MainDashboard';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  // --- SYNC STATE WITH LOCALSTORAGE ---
  // This ensures the login "sticks" even after a page refresh
  const [authState, setAuthState] = useState({
    isLoggedIn: !!localStorage.getItem('token'), 
    userRole: localStorage.getItem('role') || "TOURIST", 
    userName: localStorage.getItem('name') || "User",
    unreadNotifications: 3
  });

  // Listen for changes (Useful for your Login.jsx reload logic)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    
    if (token) {
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: true,
        userRole: role,
        userName: name
      }));
    }
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen bg-[#FFFDF7]">
        
        {/* NAVBAR: Pass real state to show/hide Dashboard, Reports, and Bell */}
        <Navbar 
          isLoggedIn={authState.isLoggedIn} 
          userRole={authState.userRole} 
          unreadNotifications={authState.unreadNotifications} 
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Home isLoggedIn={authState.isLoggedIn} userRole={authState.userRole} />
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD ROUTE: Uses role from localStorage to call DashboardServiceImpl */}
          <Route path="/dashboard" element={
            authState.isLoggedIn ? (
              <Dashboard 
                role={authState.userRole} 
                userName={authState.userName} 
              />
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* REPORTS ROUTE (Module 7): Validates role before loading ReportPage */}
          <Route path="/reports" element={
            authState.isLoggedIn ? (
              <ReportPage 
                isLoggedIn={authState.isLoggedIn} 
                userRole={authState.userRole} 
              />
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* NOTIFICATIONS ROUTE (Module 8): Maps to NotificationServiceImpl */}
          <Route path="/notifications" element={
            authState.isLoggedIn ? (
              <NotificationsPage />
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/events" element={<TouristEvents />} />
        <Route path="/programs" element={<TouristPrograms />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/admin/sites" element={<AdminHeritageSites />} />
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