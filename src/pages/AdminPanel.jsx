import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaSignOutAlt, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { adminLogin, adminDashboard, adminPendientes, adminTodosPagos, adminUsuarios, adminConfirmar, adminRechazar, adminEditarUsuario, adminEliminarUsuario, adminSolicitudes, adminAprobarSolicitud, adminRechazarSolicitud } from "../services/api";

// ── LOGIN ─────────────────────────────────────────────────────
function LoginAdmin({ onLogin }) {
  const [usuario, setUsuario] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!password) { setError("Ingresa la contraseña"); return; }
    setCargando(true); setError("");
    try {
      const res = await adminLogin({ usuario, password });
      if (res.error) return setError(res.error);
      localStorage.setItem("admin_token", res.token);
      onLogin(res);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary text-2xl font-black">A</span>
          </div>
          <h1 className="text-xl font-black text-white">PANEL ADMIN</h1>
          <p className="text-slate-400 text-sm">Playa Cañaveral</p>
        </div>
        {error && <div className="bg-red-900/30 border border-red-700 text-red-400 text-xs rounded-xl px-4 py-3 mb-4 text-center">{error}</div>}
        <div className="space-y-3">
          <input type="text" placeholder="Usuario" value={usuario} onChange={e=>setUsuario(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"/>
          <input type="password" placeholder="Contraseña" value={password}
            onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"/>
          <button onClick={handleLogin} disabled={cargando}
            className="w-full bg-primary hover:bg-primaryHover text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
            {cargando && <FaSpinner className="animate-spin" size={14}/>}
            {cargando ? "Entrando..." : "Ingresar"}
          </button>
        </div>
        <p className="text-slate-500 text-xs text-center mt-4">Contraseña por defecto: <span className="font-mono">admin123</span></p>
      </div>
    </div>
  );
}

// ── MODAL EDITAR USUARIO ─────────────────────────────────────
function ModalEditarUsuario({ usuario, onClose, onGuardado }) {
  const [form, setForm] = useState({ nombre: usuario.nombre, telefono: usuario.telefono, email: usuario.email||"", ci: usuario.ci });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const guardar = async () => {
    setCargando(true); setError("");
    try {
      const res = await adminEditarUsuario(usuario.id, form);
      if (res.error) return setError(res.error);
      onGuardado();
      onClose();
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <h3 className="font-black text-white text-lg mb-4">EDITAR USUARIO</h3>
        {error && <div className="bg-red-900/30 border border-red-700 text-red-400 text-xs rounded-xl px-4 py-3 mb-3">{error}</div>}
        {[["nombre","Nombre","text"],["ci","Carnet de identidad","text"],["telefono","Teléfono","text"],["email","Email","email"]].map(([k,ph,t]) => (
          <input key={k} type={t} placeholder={ph} value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary mb-3"/>
        ))}
        <div className="flex gap-2">
          <button onClick={guardar} disabled={cargando}
            className="flex-1 bg-primary hover:bg-primaryHover text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {cargando && <FaSpinner className="animate-spin" size={14}/>}
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-slate-600 text-slate-400 text-sm">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL VER COMPROBANTE ────────────────────────────────────
function ModalComprobante({ pago, onClose }) {
  if (!pago?.comprobante_url) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 max-w-lg w-full" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between mb-3">
          <p className="font-black text-white text-sm">Comprobante — {pago.nombre}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>
        <img src={pago.comprobante_url} alt="Comprobante" className="w-full rounded-xl max-h-96 object-contain bg-slate-900"/>
      </div>
    </div>
  );
}

// ── PANEL PRINCIPAL ──────────────────────────────────────────
export default function AdminPanel() {
  const [admin, setAdmin]             = useState(() => localStorage.getItem("admin_token") ? { token: localStorage.getItem("admin_token") } : null);
  const [tab, setTab]                 = useState("dashboard");
  const [dashboard, setDashboard]     = useState(null);
  const [pendientes, setPendientes]   = useState([]);
  const [todos, setTodos]             = useState([]);
  const [usuarios, setUsuarios]       = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando]       = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalComp, setModalComp]     = useState(null);
  const [procesando, setProcesando]   = useState({});

  const salir = () => { localStorage.removeItem("admin_token"); setAdmin(null); };

  const cargar = async () => {
    if (!admin) return;
    setCargando(true);
    try {
      if (tab === "dashboard") {
        const d = await adminDashboard();
        if (d?.error?.includes("401") || d?.error?.includes("autorizado")) { salir(); return; }
        setDashboard(d.error ? null : d);
        // También cargar count de solicitudes para el badge
        const s = await adminSolicitudes("pendiente");
        setSolicitudes(Array.isArray(s) ? s : []);
      }
      if (tab === "pendientes") { const d = await adminPendientes(); setPendientes(Array.isArray(d) ? d : []); }
      if (tab === "pagos")      { const d = await adminTodosPagos(); setTodos(Array.isArray(d) ? d : []); }
      if (tab === "usuarios")   { const d = await adminUsuarios();   setUsuarios(Array.isArray(d) ? d : []); }
      if (tab === "solicitudes"){ const d = await adminSolicitudes("pendiente"); setSolicitudes(Array.isArray(d) ? d : []); }
    } catch (err) {
      console.error("Error cargando datos admin:", err.message);
    }
    setCargando(false);
  };

  useEffect(() => { if (admin) cargar(); }, [tab, admin]);

  const accion = async (fn, key) => {
    setProcesando(p=>({...p,[key]:true}));
    try { await fn(); cargar(); } catch (e) { alert(e.message); }
    finally { setProcesando(p=>({...p,[key]:false})); }
  };


  if (!admin) return <LoginAdmin onLogin={setAdmin}/>;

  const TABS = [
    { key:"dashboard",   label:"Dashboard"   },
    { key:"solicitudes", label:`Solicitudes${solicitudes.length>0?` (${solicitudes.length})`:""}` },
    { key:"pendientes",  label:`Pagos${pendientes.length>0?` (${pendientes.length})`:""}` },
    { key:"pagos",       label:"Historial"   },
    { key:"usuarios",    label:"Usuarios"    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {modalEditar && <ModalEditarUsuario usuario={modalEditar} onClose={()=>setModalEditar(null)} onGuardado={cargar}/>}
      {modalComp   && <ModalComprobante  pago={modalComp}     onClose={()=>setModalComp(null)}/>}

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-black text-white text-lg">PANEL ADMIN</p>
          <p className="text-slate-400 text-xs">Playa Cañaveral · Bermejo, Tarija</p>
        </div>
        <button onClick={salir} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
          <FaSignOutAlt size={14}/> Salir
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 flex gap-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition-colors
              ${tab===t.key ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
        <button onClick={cargar} className="ml-auto px-3 py-3 text-slate-400 hover:text-white">
          {cargando ? <FaSpinner className="animate-spin" size={14}/> : "↻"}
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto">

        {/* DASHBOARD */}
        {tab==="dashboard" && dashboard && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label:"Usuarios",    val:dashboard.usuarios,           color:"text-blue-400"   },
                { label:"Membresías",  val:dashboard.membresiasActivas,  color:"text-green-400"  },
                { label:"Solicitudes", val:dashboard.solicitudesPendientes, color:"text-yellow-400" },
                { label:"Pagos pend.", val:dashboard.pagosPendientes,    color:"text-orange-400" },
                { label:"Confirmados", val:dashboard.pagosConfirmados,   color:"text-green-400"  },
                { label:"Ingresos",    val:`$${(dashboard.ingresoTotal||0).toLocaleString()}`, color:"text-primary" },
              ].map((s,i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <p className="font-black text-white text-sm mb-3">ESTADO DE LOTES</p>
              <div className="flex flex-wrap gap-3">
                {dashboard.lotes?.map((l,i) => (
                  <div key={i} className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                    l.estado==="disponible" ? "bg-green-900/30 text-green-400 border-green-800" :
                    l.estado==="reservado"  ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" :
                    "bg-red-900/30 text-red-400 border-red-800"}`}>
                    {l.estado}: {l.count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SOLICITUDES DE CUOTAS */}
        {tab==="solicitudes" && (
          <div>
            <p className="font-black text-white text-lg mb-4">SOLICITUDES DE PLAN DE CUOTAS</p>
            {solicitudes.length === 0 && !cargando && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
                <FaCheckCircle className="text-green-500 mx-auto mb-3" size={36}/>
                <p className="text-slate-300 font-semibold">Sin solicitudes pendientes</p>
              </div>
            )}
            <div className="space-y-4">
              {solicitudes.map(s => (
                <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-black text-white text-base">{s.nombre}</p>
                      <p className="text-slate-400 text-sm">
                        Código: <span className="font-mono text-primary">{s.codigo_usuario}</span> · CI: {s.ci} · {s.telefono}
                      </p>
                      <p className="text-slate-300 text-sm mt-1">
                        Lote: <strong>{s.codigo_lote}</strong> Mz.{s.manzana} ·
                        <strong className="text-primary ml-1">{s.num_cuotas} cuotas</strong> de
                        <strong className="text-primary ml-1">${Number(s.monto_cuota).toLocaleString()}</strong>/mes ·
                        Total: <strong className="text-white">${Number(s.precio_total).toLocaleString()}</strong>
                      </p>
                      <p className="text-slate-500 text-xs mt-1">{new Date(s.created_at).toLocaleString("es-BO")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => accion(()=>adminAprobarSolicitud(s.id), `apr-${s.id}`)}
                        disabled={!!procesando[`apr-${s.id}`]}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black px-5 py-2 rounded-xl text-sm disabled:opacity-60 transition-colors">
                        {procesando[`apr-${s.id}`] ? <FaSpinner className="animate-spin" size={12}/> : <FaCheckCircle size={12}/>}
                        Aprobar y generar cuotas
                      </button>
                      <button onClick={() => accion(()=>adminRechazarSolicitud(s.id,"Solicitud rechazada"), `rec-${s.id}`)}
                        disabled={!!procesando[`rec-${s.id}`]}
                        className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-black px-4 py-2 rounded-xl text-sm disabled:opacity-60 transition-colors">
                        {procesando[`rec-${s.id}`] ? <FaSpinner className="animate-spin" size={12}/> : <FaTimesCircle size={12}/>}
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGOS PENDIENTES */}
        {tab==="pendientes" && (
          <div>
            <p className="font-black text-white text-lg mb-4">PAGOS PENDIENTES DE VERIFICACIÓN</p>
            {pendientes.length === 0 && !cargando && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
                <FaCheckCircle className="text-green-500 mx-auto mb-3" size={36}/>
                <p className="text-slate-300 font-semibold">Sin pagos pendientes</p>
              </div>
            )}
            <div className="space-y-4">
              {pendientes.map(p => (
                <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-yellow-900/50 text-yellow-400 border border-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">Pendiente</span>
                        <span className="text-slate-400 text-xs">{new Date(p.created_at).toLocaleString("es-BO")}</span>
                      </div>
                      <p className="font-black text-white">{p.nombre}</p>
                      <p className="text-slate-400 text-sm">
                        <span className="font-mono text-primary">{p.codigo_usuario}</span> · {p.plan} · Cuota {p.numero_cuota} · <span className="text-primary font-black">${p.monto}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {p.comprobante_url && (
                        <button onClick={()=>setModalComp(p)}
                          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2 rounded-xl text-xs">
                          <FaEye size={12}/> Comprobante
                        </button>
                      )}
                      <button onClick={()=>accion(()=>adminConfirmar(p.id), `conf-${p.id}`)}
                        disabled={!!procesando[`conf-${p.id}`]}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black px-5 py-2 rounded-xl text-sm disabled:opacity-60">
                        {procesando[`conf-${p.id}`] ? <FaSpinner className="animate-spin" size={12}/> : <FaCheckCircle size={12}/>}
                        Confirmar
                      </button>
                      <button onClick={()=>accion(()=>adminRechazar(p.id), `rech-${p.id}`)}
                        disabled={!!procesando[`rech-${p.id}`]}
                        className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-black px-4 py-2 rounded-xl text-sm disabled:opacity-60">
                        {procesando[`rech-${p.id}`] ? <FaSpinner className="animate-spin" size={12}/> : <FaTimesCircle size={12}/>}
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIAL PAGOS */}
        {tab==="pagos" && (
          <div>
            <p className="font-black text-white text-lg mb-4">HISTORIAL DE PAGOS</p>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700 text-slate-300 text-xs uppercase tracking-widest">
                    <tr>{["Usuario","Plan / Cuota","Monto","Método","Estado","Fecha"].map(h=>(
                      <th key={h} className={`px-4 py-3 ${h==="Monto"?"text-right":"text-left"}`}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {todos.map((p,i) => (
                      <tr key={i} className="border-t border-slate-700">
                        <td className="px-4 py-3"><p className="font-semibold text-white">{p.nombre}</p><p className="text-slate-400 text-xs font-mono">{p.codigo_usuario}</p></td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{p.plan||"Lote"} · Cuota {p.numero_cuota||"—"}</td>
                        <td className="px-4 py-3 text-right font-black text-primary">${p.monto}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{p.metodo}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            p.estado==="confirmado" ? "bg-green-900/50 text-green-400" :
                            p.estado==="rechazado"  ? "bg-red-900/50 text-red-400" :
                            "bg-yellow-900/50 text-yellow-400"}`}>{p.estado}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{new Date(p.created_at).toLocaleDateString("es-BO")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USUARIOS */}
        {tab==="usuarios" && (
          <div>
            <p className="font-black text-white text-lg mb-4">CLIENTES REGISTRADOS</p>
            <div className="space-y-3">
              {usuarios.map((u,i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-white">{u.nombre}</p>
                      <span className="font-mono text-primary text-xs">{u.codigo_usuario}</span>
                      {u.codigo_lote && <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">🏠 {u.codigo_lote}</span>}
                      {u.plan && <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full">🏊 {u.plan}</span>}
                    </div>
                    <p className="text-slate-400 text-xs">CI: {u.ci} · {u.telefono} · {u.email||"sin email"}</p>
                    <p className="text-slate-500 text-xs">Registro: {new Date(u.created_at).toLocaleDateString("es-BO")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>setModalEditar(u)}
                      className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl text-xs font-bold">
                      <FaEdit size={11}/> Editar
                    </button>
                    <button onClick={()=>{if(confirm(`¿Eliminar a ${u.nombre}? Esta acción liberará su lote.`)) accion(()=>adminEliminarUsuario(u.id), `del-${u.id}`)}}
                      disabled={!!procesando[`del-${u.id}`]}
                      className="flex items-center gap-1 bg-red-800 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-60">
                      {procesando[`del-${u.id}`] ? <FaSpinner className="animate-spin" size={11}/> : <FaTrash size={11}/>}
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
