import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaSpinner, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { registrar, loginUsuario } from "../services/api";

export default function AuthPage({ modo = "login", onAuth }) {
  const [tab, setTab]           = useState(modo);
  const [loginInput, setLoginInput] = useState(""); // campo único CI o código
  const [form, setForm]         = useState({ nombre:"", telefono:"", ci:"", fechaNacimiento:"", email:"", password:"", confirmar:"" });
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);
  const [verPass, setVerPass]   = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setError(""); };

  const guardarSesion = (res) => {
    localStorage.setItem("user_token",       res.token);
    localStorage.setItem("user_codigo",      res.codigoUsuario);
    localStorage.setItem("user_nombre",      res.nombre);
    localStorage.setItem("user_ci",          res.ci || "");
    localStorage.setItem("user_telefono",    res.telefono || "");
    localStorage.setItem("user_email",       res.email || "");
    localStorage.setItem("user_fechaNac",    res.fechaNacimiento || "");
  };

  const handleSubmit = async () => {
    setError(""); setCargando(true);
    try {
      let res;
      if (tab === "registro") {
        if (!form.nombre || !form.ci || !form.fechaNacimiento || !form.telefono || !form.password)
          return setError("Completa todos los campos obligatorios");
        if (form.password !== form.confirmar)
          return setError("Las contraseñas no coinciden");
        if (form.password.length < 6)
          return setError("La contraseña debe tener al menos 6 caracteres");
        res = await registrar(form);
      } else {
        if (!loginInput.trim() || !form.password)
          return setError("Ingresa tu CI o código de usuario y tu contraseña");
        res = await loginUsuario({ ci: loginInput.trim(), password: form.password });
      }
      if (res.error) return setError(res.error);
      guardarSesion(res);
      if (onAuth) onAuth(res);
      navigate("/mi-cuenta");
    } catch (e) { setError("Error de conexión. Verifica que el servidor esté activo."); }
    finally { setCargando(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden bg-gradient-to-br from-green-900 via-green-700 to-emerald-500">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-black/40"/>
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"/>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"/>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">

        {/* Logo y título */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <img src="/fotos/logo.png" alt="Logo" className="w-14 h-14 object-contain"
              onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
            <div style={{display:"none"}} className="w-14 h-14 items-center justify-center">
              <FaHome className="text-white" size={32}/>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">PLAYA CAÑAVERAL</h1>
          <p className="text-white/70 text-sm mt-1">Bermejo, Tarija · Bolivia</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/20 rounded-xl p-1 mb-6">
          {[["login","Iniciar Sesión"],["registro","Crear Cuenta"]].map(([k,l]) => (
            <button key={k} onClick={()=>{setTab(k);setError("");setLoginInput("");}}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all
                ${tab===k ? "bg-white text-green-800 shadow-sm" : "text-white/70 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 text-xs rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {tab === "registro" && (
            <input type="text" placeholder="Nombre completo *" value={form.nombre}
              onChange={e=>set("nombre",e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"/>
          )}

          {/* LOGIN: campo único sin regex, acepta cualquier texto */}
          {tab === "login" && (
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14}/>
              <input
                type="text"
                placeholder="CI o código de usuario"
                value={loginInput}
                onChange={e => { setLoginInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"
              />
            </div>
          )}

          {/* REGISTRO: campo CI separado */}
          {tab === "registro" && (
            <input type="text" placeholder="Carnet de identidad *" value={form.ci}
              onChange={e=>set("ci",e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"/>
          )}

          {tab === "registro" && (
            <>
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 ml-1">
                  Fecha de nacimiento *
                </label>
                <input type="date" value={form.fechaNacimiento}
                  onChange={e=>set("fechaNacimiento",e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"/>
              </div>
              <input type="text" placeholder="WhatsApp / Teléfono *" value={form.telefono}
                onChange={e=>set("telefono",e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"/>
              <input type="email" placeholder="Correo electrónico (opcional)" value={form.email}
                onChange={e=>set("email",e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"/>
            </>
          )}

          {/* Contraseña */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14}/>
            <input type={verPass?"text":"password"} placeholder="Contraseña *" value={form.password}
              onChange={e=>set("password",e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl pl-11 pr-11 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"/>
            <button type="button" onClick={()=>setVerPass(v=>!v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
              {verPass ? <FaEyeSlash size={16}/> : <FaEye size={16}/>}
            </button>
          </div>

          {tab === "registro" && (
            <input type={verPass?"text":"password"} placeholder="Confirmar contraseña *" value={form.confirmar}
              onChange={e=>set("confirmar",e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"/>
          )}

          <button onClick={handleSubmit} disabled={cargando}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-green-900 font-black py-3.5 rounded-xl text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100 mt-2 shadow-lg">
            {cargando && <FaSpinner className="animate-spin" size={14}/>}
            {cargando ? "Procesando..." : tab==="login" ? "INICIAR SESIÓN" : "CREAR MI CUENTA"}
          </button>
        </div>

        {tab === "registro" && (
          <p className="text-white/50 text-xs text-center mt-4">
            Al registrarte recibirás un código único para hacer seguimiento de tu lote.
          </p>
        )}

        {tab === "login" && (
          <p className="text-white/50 text-xs text-center mt-4">
            Ingresa el CI o código que usaste al registrarte.
          </p>
        )}

        <div className="text-center mt-5">
          <Link to="/" className="text-white/50 hover:text-white text-xs transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
