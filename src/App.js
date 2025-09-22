import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Peliculas from './pages/Peliculas';
import Series from './pages/Series';
import Estrenos from './pages/Estrenos';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import NoAutorizado from './pages/NoAutorizado';
import Detalle from './pages/Detalle';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const ocultarNavbarEn = ['/login', '/admin', '/no-autorizado'];
  const mostrarNavbar = !ocultarNavbarEn.includes(location.pathname);

  return (
    <>
      {mostrarNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/series" element={<Series />} />
        <Route path="/estrenos" element={<Estrenos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/detalle/:tipo/:id" element={<Detalle />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;