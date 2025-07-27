import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import CalendarPage from './components/CalendarPage';
import { useAuth } from './firebase';
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Router>
      {user && (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <span>안녕하세요, {user.name}님</span>
          <button onClick={handleLogout} className="bubble-button" style={{ padding: '6px 12px', borderRadius: '16px' }}>로그아웃</button>
        </header>
      )}
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/calendar" />} />
        <Route path="/calendar" element={user ? <CalendarPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppContent;
