import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Calendar from '../pages/Calendar';
import Profile from '../pages/Profile';

export default function App() {
  return (
    <Routes>
      {/* default route redirects to /dashboard */}
      <Route path="/" element={<Navigate to="/calendar" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/profile" element={<Profile />} />


      {/* fallback for unknown routes */}
      <Route path="*" element={<h2>404 - Page not found</h2>} />
    </Routes>
  );
}
