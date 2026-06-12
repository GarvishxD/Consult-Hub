import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Admin from './pages/Admin';
import Clients from './pages/Clients';
import Consultations from './pages/Consultations';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Recordings from './pages/Recordings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="clients" element={
                <ProtectedRoute><Clients /></ProtectedRoute>
              } />
              <Route path="consultations" element={
                <ProtectedRoute><Consultations /></ProtectedRoute>
              } />
              <Route path="recordings" element={
                <ProtectedRoute><Recordings /></ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
              } />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
