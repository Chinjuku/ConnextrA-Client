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


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('auth')
  return isAuthenticated === "true" ? children : <Navigate to="/login" />;
};

// ใช้งานใน App Component
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/login" element={<Authenticate />} />
      <Route path="/find-friend" element={<FindFriend />} />
      <Route path="/find-group" element={<FindGroup />} />
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}


export default App;
