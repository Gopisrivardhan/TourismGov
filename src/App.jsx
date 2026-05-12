import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar';

// --- PAGES ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Your unified Dashboard
import ReportPage from './pages/ReportPage'; // Your Intelligence Reports

function App() {
  // --- GLOBAL STATE ---
  // In a real app, this would be updated by your Login logic or a Context Provider
  const [authState, setAuthState] = useState({
    isLoggedIn: true,       // Toggle to false to see the Login view
    userRole: "ADMIN",     // Roles: "ADMIN", "OFFICER", "COMPLIANCE", "TOURIST"
    userName: "Omkar",
    unreadNotifications: 5
  });

  return (
    <Router>
      <div className="relative min-h-screen bg-[#FFFDF7]">
        
        {/* NAVBAR: Global component 
          This ensures the Notification Hub is visible on EVERY page 
        */}
        <Navbar 
          isLoggedIn={authState.isLoggedIn} 
          userRole={authState.userRole} 
          unreadNotifications={authState.unreadNotifications} 
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Home 
              isLoggedIn={authState.isLoggedIn} 
              userRole={authState.userRole} 
            />
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD ROUTE: 
             One route that dynamically changes content based on authState.userRole
          */}
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

          {/* REPORTS ROUTE: 
             Matches your ReportServiceImpl.java logic (Tourists get "Access Denied")
          */}
          <Route path="/reports" element={
            authState.isLoggedIn ? (
              <ReportPage 
                isLoggedIn={authState.isLoggedIn} 
                userRole={authState.userRole} 
                unreadNotifications={authState.unreadNotifications}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;