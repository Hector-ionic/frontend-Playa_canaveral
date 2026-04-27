import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Home from "./pages/Home";
import Lotes from "./pages/Lotes";
import Membresia from "./pages/Membresia";
import Proyectos from "./pages/Proyectos";
import Contacto from "./pages/Contacto";
import MiCuenta from "./pages/MiCuenta";
import AuthPage from "./pages/AuthPage";
import AdminPanel from "./pages/AdminPanel";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <WhatsAppFloat />
      <Footer />
    </>
  );
}

// Ruta protegida — redirige a login si no hay sesión
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("user_token");
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const [userActivo, setUserActivo] = useState(!!localStorage.getItem("user_token"));

  const onAuth = () => setUserActivo(true);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin standalone */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Auth */}
        <Route path="/auth" element={
          <MainLayout><AuthPage onAuth={onAuth} /></MainLayout>
        } />
        <Route path="/registro" element={
          <MainLayout><AuthPage modo="registro" onAuth={onAuth} /></MainLayout>
        } />

        {/* Rutas protegidas */}
        <Route path="/mi-cuenta" element={
          <MainLayout>
            <ProtectedRoute><MiCuenta /></ProtectedRoute>
          </MainLayout>
        } />

        {/* Rutas públicas */}
        <Route path="/"         element={<MainLayout><Home /></MainLayout>} />
        <Route path="/lotes"    element={<MainLayout><Lotes /></MainLayout>} />
        <Route path="/membresia" element={<MainLayout><Membresia /></MainLayout>} />
        <Route path="/proyectos" element={<MainLayout><Proyectos /></MainLayout>} />
        <Route path="/contacto"  element={<MainLayout><Contacto /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
