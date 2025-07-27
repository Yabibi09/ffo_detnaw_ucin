import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CalendarPage from './components/CalendarPage';
import AdminPage from './components/AdminPage';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/calendar" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;