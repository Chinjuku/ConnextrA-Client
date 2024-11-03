import { Route, Routes, Navigate } from 'react-router-dom';
import Chat from '@/pages/Chat';
import FindFriend from '@/pages/FindFriend';
import NotFound from '@/pages/404';
import FindGroup from '@/pages/FindGroup';
import CreateGroup from '@/pages/CreateGroup';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Authenticate from './pages/Login';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

// กำหนด PrivateRoute เพื่อเช็คสิทธิ์การเข้าถึง
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useContext(UserContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};


// App Component
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Authenticate />} />
      
      {/* หน้าอื่นที่ต้องการการตรวจสอบสิทธิ์ */}
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/find-friend/:userId" element={<PrivateRoute><FindFriend /></PrivateRoute>} />
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
