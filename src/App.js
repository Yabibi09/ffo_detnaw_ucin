import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CalendarPage from './components/CalendarPage';
import AdminPage from './components/AdminPage';
import { useAuth } from './firebase';

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/calendar" />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
