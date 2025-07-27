import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CalendarPage from './components/CalendarPage';
import { useAuth } from './firebase';

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/calendar" />} />
        <Route path="/calendar" element={user ? <CalendarPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;