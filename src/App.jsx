import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminEvents from './pages/AdminEvents';
import TouristEvents from './pages/TouristEvents';
import AdminPrograms from './pages/AdminPrograms';
import TouristPrograms from './pages/TouristPrograms';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-events" element={<AdminEvents />} />
        <Route path="/events" element={<TouristEvents />} />
        <Route path="/programs" element={<TouristPrograms />} />
        <Route path="/admin-programs" element={<AdminPrograms />} />
      </Routes>
    </Router>
  );
}

export default App;