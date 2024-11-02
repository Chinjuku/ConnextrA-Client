import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Chat from '@/pages/Chat';
import FindFriend from '@/pages/FindFriend';
import NotFound from '@/pages/404';
import FindGroup from '@/pages/FindGroup';
import CreateGroup from '@/pages/CreateGroup';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Authenticate from './pages/Login';

// กำหนด PrivateRoute เพื่อเช็คสิทธิ์การเข้าถึง
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('auth') === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// App Component
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Authenticate />} />
      
      {/* หน้าอื่นที่ต้องการการตรวจสอบสิทธิ์ */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/find-friend" element={<PrivateRoute><FindFriend /></PrivateRoute>} />
      <Route path="/find-group" element={<PrivateRoute><FindGroup /></PrivateRoute>} />
      <Route path="/create-group" element={<PrivateRoute><CreateGroup /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* กรณีที่ไม่พบหน้า */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
