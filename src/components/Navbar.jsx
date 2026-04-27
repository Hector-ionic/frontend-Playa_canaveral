import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useDarkMode } from "../hooks/UseDarkMode";

const LINKS = [
  { label: "INICIO",    to: "/"           },
  { label: "LOTES",     to: "/lotes"      },
  { label: "MEMBRESÍA", to: "/membresia"  },
  { label: "PROYECTOS", to: "/proyectos"  },
  { label: "MI CUENTA", to: "/mi-cuenta"  },
  { label: "CONTACTO",  to: "/contacto"   },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const isHome                    = location.pathname === "/";
  const { isDark, toggle }        = useDarkMode();

  // Estado de sesión del usuario
  const [userNombre, setUserNombre] = useState(localStorage.getItem("user_nombre") || "");

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    setUserNombre(localStorage.getItem("user_nombre") || "");
  }, [location.pathname]);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const fn = () => setScrolled(window.scrollY > window.innerHeight * 0.9);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [isHome]);

  const solid = !isHome || scrolled;

  const cerrarSesion = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_codigo");
    localStorage.removeItem("user_nombre");
    setUserNombre("");
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center justify-between px-4 md:px-10 overflow-visible
        ${solid ? "bg-white dark:bg-slate-900 shadow-md" : "bg-transparent"}`}>

        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/fotos/logo.png" alt="Playa Cañaveral"
            className="h-20 w-auto object-contain relative -mb-3"
            style={{ marginTop: "10px" }} />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {LINKS.map(({ label, to }) => (
            <Link key={to} to={to}
              className={`text-sm font-medium transition-colors
                ${solid ? "text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
                        : "text-white/90 hover:text-white"}
                ${location.pathname === to ? "font-bold border-b-2 border-primary" : ""}`}>
              {label}
            </Link>
          ))}

          <button onClick={toggle} aria-label="Cambiar tema"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
              ${solid ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-yellow-300"
                      : "bg-white/15 hover:bg-white/25 text-white"}`}>
            {isDark ? <FaSun size={15}/> : <FaMoon size={15}/>}
          </button>

          {userNombre ? (
            <div className="flex items-center gap-2">
              <Link to="/mi-cuenta"
                className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full transition-colors
                  ${solid ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-white/15 text-white hover:bg-white/25"}`}>
                <FaUser size={12}/> {userNombre.split(" ")[0]}
              </Link>
              <button onClick={cerrarSesion}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                  ${solid ? "bg-red-50 hover:bg-red-100 text-red-500" : "bg-white/15 hover:bg-white/25 text-white"}`}
                title="Cerrar sesión">
                <FaSignOutAlt size={14}/>
              </button>
            </div>
          ) : (
            <Link to="/auth"
              className="bg-primary hover:bg-primaryHover text-white text-sm font-bold px-5 py-2 rounded-full shadow-md transition-colors ml-1">
              PRE-RESERVAR
            </Link>
          )}
        </div>

        {/* Móvil */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} aria-label="Cambiar tema"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
              ${solid ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-yellow-300" : "bg-white/15 text-white"}`}>
            {isDark ? <FaSun size={14}/> : <FaMoon size={14}/>}
          </button>
          <button onClick={() => setMenuOpen(v => !v)} aria-label="Menú" className="flex flex-col gap-1.5 p-2 rounded-lg">
            <span className={`block w-6 h-0.5 transition-all duration-300 ${solid ? "bg-slate-700 dark:bg-slate-200" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`}/>
            <span className={`block w-6 h-0.5 transition-all duration-300 ${solid ? "bg-slate-700 dark:bg-slate-200" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`}/>
            <span className={`block w-6 h-0.5 transition-all duration-300 ${solid ? "bg-slate-700 dark:bg-slate-200" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}/>
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-white dark:bg-slate-900 shadow-xl transition-all duration-300 md:hidden overflow-hidden
        ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col px-6 py-4 gap-1">
          {LINKS.map(({ label, to }) => (
            <Link key={to} to={to}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors
                ${location.pathname === to ? "bg-primary/10 text-primary font-bold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 dark:border-slate-700 mt-2 pt-2">
            {userNombre ? (
              <>
                <Link to="/mi-cuenta" className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-primary">
                  <FaUser size={12}/> {userNombre}
                </Link>
                <button onClick={cerrarSesion} className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                  <FaSignOutAlt className="inline mr-2" size={12}/> Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/auth" className="mt-2 bg-primary hover:bg-primaryHover text-white font-bold px-6 py-3 rounded-xl text-sm text-center transition-colors block">
                PRE-RESERVAR / INICIAR SESIÓN
              </Link>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-black/20 dark:bg-black/40" onClick={() => setMenuOpen(false)}/>
      )}
    </>
  );
}
