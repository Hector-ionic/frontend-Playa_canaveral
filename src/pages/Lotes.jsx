import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PlanoInteractivo from "../components/PlanoInteractivo";
import { getLotes } from "../services/lotsService";
import { reservarLote } from "../services/api";

const statusConfig = {
  disponible: { label:"Disponible", bg:"#e8f8ef", border:"#2ecc71", text:"#1a9e52", dot:"#2ecc71" },
  reservado:  { label:"Reservado",  bg:"#fff8e1", border:"#f5a623", text:"#c47d00", dot:"#f5a623" },
  vendido:    { label:"Vendido",    bg:"#fdecea", border:"#e74c3c", text:"#c0392b", dot:"#e74c3c" },
};
const ZONAS = ["all","A","B","C","D","E","G","H","I"];

// Leer datos del usuario logueado desde localStorage
function getDatosUsuario() {
  return {
    nombre:          localStorage.getItem("user_nombre") || "",
    ci:              localStorage.getItem("user_ci") || "",
    telefono:        localStorage.getItem("user_telefono") || "",
    email:           localStorage.getItem("user_email") || "",
    fechaNacimiento: localStorage.getItem("user_fechaNac") || "",
  };
}

export default function Lotes() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [lotes, setLotes]               = useState([]);
  const [vista, setVista]               = useState(searchParams.get("vista") === "grilla" ? "grilla" : "mapa");
  const [filterZona, setFilterZona]     = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [conMembresia, setConMembresia] = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState(getDatosUsuario());
  const [enviado, setEnviado]           = useState(false);
  const [respuesta, setRespuesta]       = useState(null);
  const [formError, setFormError]       = useState("");
  const [cargando, setCargando]         = useState(false);

  const estaLogueado = !!localStorage.getItem("user_token");

  useEffect(() => {
    getLotes().then(data => { if (Array.isArray(data)) setLotes(data); })
      .catch(() => import("../data/lotes.json").then(m => setLotes(m.default)));
  }, []);

  const abrirModal = (lote, membresia = false) => {
    setLoteSeleccionado(lote);
    setConMembresia(membresia);
    setEnviado(false);
    setRespuesta(null);
    setFormError("");
    setCargando(false);
    // Siempre pre-llenar con datos del usuario logueado
    setForm(getDatosUsuario());
    setShowModal(true);
  };

  const cerrarModal = () => { setShowModal(false); setLoteSeleccionado(null); setRespuesta(null); setFormError(""); setCargando(false); };

  const handleSubmit = async () => {
    const { nombre, telefono, ci, fechaNacimiento } = form;
    if (!nombre || !telefono || !ci || !fechaNacimiento) {
      setFormError("Completa todos los campos obligatorios."); return;
    }
    setFormError(""); setCargando(true);
    try {
      const resultado = await reservarLote({ nombre, telefono, ci, fechaNacimiento, email: form.email, loteId: loteSeleccionado.id });
      if (resultado.error) { setFormError(resultado.error); return; }
      setRespuesta(resultado);
      setEnviado(true);
      setLotes(prev => prev.map(l => l.id === loteSeleccionado.id ? { ...l, estado: "reservado" } : l));
      // Guardar código si no tenía sesión
      if (!estaLogueado && resultado.codigoUsuario) {
        localStorage.setItem("user_codigo", resultado.codigoUsuario);
      }
    } catch (err) { setFormError(err.message); }
    finally { setCargando(false); }
  };

  const totalDisponibles = lotes.filter(l => ZONAS.includes(l.zona) && l.estado === "disponible").length;
  const lotesFiltrados   = lotes.filter(l => ZONAS.includes(l.zona) && (filterZona==="all"||l.zona===filterZona) && (filterEstado==="all"||l.estado===filterEstado));

  const inputCls = "w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary transition-colors";

  return (
    <main className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 md:px-10 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-2">Disponibilidad</p>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white mb-1">ELIGE TU LOTE IDEAL</h1>
          <p className="text-slate-400 dark:text-slate-300 text-sm">
            Playa Cañaveral · <strong className="text-slate-600 dark:text-slate-300">Bermejo, Tarija</strong> · {totalDisponibles} disponibles · 250 m²
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-6 md:py-8">

        {/* Sección convencimiento + botón asesor */}
        {vista === "grilla" && (
          <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row items-stretch gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-2xl pointer-events-none"/>
            <div className="relative z-10 flex-shrink-0 w-full md:w-64 flex md:flex-col justify-center">
              <a href={`https://wa.me/59171295179?text=${encodeURIComponent("Hola, quiero información sobre los lotes de Playa Cañaveral.")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-black px-6 py-6 rounded-2xl shadow-2xl transition-all hover:scale-105 w-full text-center border-4 border-yellow-300">
                <div className="w-14 h-14 bg-green-900 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-yellow-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.724.885.916-3.619-.235-.372A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.423-4.394 9.818-9.818 9.818z"/></svg>
                </div>
                <div><p className="font-black text-green-900 text-lg leading-tight">HABLAR CON UN ASESOR</p><p className="text-green-800 text-sm font-bold mt-1">Responde en minutos</p></div>
              </a>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <p className="text-yellow-300 text-xs font-bold tracking-widest uppercase mb-3">¿Por qué actuar hoy?</p>
              <p className="text-white text-base md:text-lg font-black leading-snug mb-3">Cada semana quedan menos lotes. El que no reserva hoy, mañana paga más por menos.</p>
              <p className="text-white/85 text-sm md:text-base leading-relaxed mb-4">Por <strong className="text-yellow-300">menos de lo que pagas de alquiler</strong>, tienes 250 m² a tu nombre en Bermejo — con parque acuático incluido. Financiamiento desde el día uno.</p>
              <div className="flex flex-wrap gap-2">
                {["Propiedad real y escriturada","Desde $1 al día","Parque Acuático incluido","Sin cuota inicial"].map(t=>(
                  <span key={t} className="bg-white/15 border border-white/25 text-white text-xs font-bold px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Banner membresía */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">🏖️</span>
            <div>
              <p className="text-white font-black text-sm">¡Incluye Membresía Parque Acuático!</p>
              <p className="text-white/80 text-xs">Acceso de por vida para 5 personas · A 15 min de Bermejo</p>
            </div>
          </div>
          <span className="bg-yellow-400 text-green-900 text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap">Beneficio exclusivo</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[{key:"mapa",label:"🗺️ Plano"},{key:"grilla",label:"⊞ Todos los lotes"}].map(({key,label})=>(
            <button key={key} onClick={()=>setVista(key)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                ${vista===key ? "bg-primary text-white shadow-md" : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-primary hover:text-primary"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Filtros grilla */}
        {vista==="grilla" && (
          <>
            <div className="flex gap-2 flex-wrap mb-5">
              <span className="text-xs text-slate-400 font-medium self-center">Manzana:</span>
              {ZONAS.map(z=>(
                <button key={z} onClick={()=>setFilterZona(z)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${filterZona===z ? "bg-primary text-white" : "bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-primary hover:text-primary"}`}>
                  {z==="all"?"Todas":z}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap mb-5">
              <span className="text-xs text-slate-400 font-medium self-center">Estado:</span>
              {["all","disponible","reservado","vendido"].map(s=>(
                <button key={s} onClick={()=>setFilterEstado(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all
                    ${filterEstado===s ? "bg-primary text-white" : "bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-primary hover:text-primary"}`}>
                  {s==="all"?"Todos":s}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mb-5 flex-wrap">
              {Object.entries(statusConfig).map(([k,v])=>(
                <div key={k} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:v.dot}}/>
                  <span className="text-xs text-slate-400">{v.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Vista mapa */}
        {vista==="mapa" && (
          <div>
            <p className="text-xs text-slate-400 mb-3">📍 <strong>Bermejo, Tarija</strong> · Explora el plano del condominio</p>
            <PlanoInteractivo onReservar={abrirModal}/>
          </div>
        )}

        {/* Vista grilla */}
        {vista==="grilla" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {lotesFiltrados.map(lote => {
              const cfg = statusConfig[lote.estado];
              return (
                <div key={lote.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
                  style={{ borderTop:`3px solid ${cfg.dot}`, opacity: lote.estado==="vendido"?0.6:1 }}>
                  <div className="p-4 md:p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">Lote</p>
                        <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">{lote.id}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Mz. {lote.zona} · Bermejo</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{background:cfg.bg,color:cfg.text,border:`1px solid ${cfg.border}`}}>{cfg.label}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div><p className="text-xs text-slate-400">Superficie</p><p className="text-sm font-bold text-slate-600 dark:text-slate-300">{lote.superficie} m²</p></div>
                      <div className="text-right"><p className="text-xs text-slate-400">Precio</p><p className="text-base md:text-lg font-black text-primary">${lote.precio?.toLocaleString()}</p></div>
                    </div>
                    {lote.estado==="disponible" && (
                      <div className="flex flex-col gap-2">
                        <button onClick={()=>abrirModal(lote,false)} className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-2.5 rounded-xl text-xs transition-colors">🏠 Pre-Reservar Lote</button>
                        <button onClick={()=>abrirModal(lote,true)} className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all">🏖️ Pre-Reservar + Membresía</button>
                      </div>
                    )}
                    {lote.estado==="reservado" && <div className="w-full text-center py-2.5 rounded-xl text-xs font-bold" style={{background:cfg.bg,color:cfg.text}}>En proceso de reserva</div>}
                    {lote.estado==="vendido"   && <div className="w-full text-center py-2.5 rounded-xl text-xs font-bold" style={{background:cfg.bg,color:cfg.text}}>No disponible</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && loteSeleccionado && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 backdrop-blur-sm" onClick={cerrarModal}>
          <div className="bg-white dark:bg-slate-800 w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            {!enviado ? (
              <>
                <div className="w-10 h-1 bg-gray-200 dark:bg-slate-600 rounded-full mx-auto mb-4 sm:hidden"/>
                <div className="text-center mb-5">
                  <span className="text-3xl">{conMembresia?"🏖️":"🏠"}</span>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mt-2">{conMembresia?"Lote + Membresía":"Pre-Reservar"} · {loteSeleccionado.id}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-300 mt-1">📍 Bermejo, Tarija</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <span className="text-sm text-slate-400">{loteSeleccionado.superficie} m²</span>
                    <span className="text-sm font-black text-primary">${loteSeleccionado.precio?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Aviso si está logueado */}
                {estaLogueado && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-2.5 mb-4">
                    <p className="text-green-700 dark:text-green-400 text-xs font-bold">✓ Sesión activa — datos pre-llenados</p>
                  </div>
                )}

                {formError && <div className="bg-red-50 border border-red-200 text-red-500 text-xs rounded-xl px-4 py-3 mb-3">{formError}</div>}

                {/* Campos — solo mostramos los que falten */}
                {[
                  { key:"nombre",          type:"text",  ph:"Nombre completo *",      label:null },
                  { key:"ci",              type:"text",  ph:"Carnet de identidad *",   label:null },
                  { key:"fechaNacimiento", type:"date",  ph:"",                         label:"Fecha de nacimiento *" },
                  { key:"telefono",        type:"text",  ph:"WhatsApp / Teléfono *",   label:null },
                  { key:"email",           type:"email", ph:"Correo electrónico",       label:null },
                ].map(f => (
                  <div key={f.key} className="mb-3">
                    {f.label && <label className="block text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1">{f.label}</label>}
                    <input type={f.type} placeholder={f.ph} value={form[f.key]}
                      onChange={e => { setForm({...form,[f.key]:e.target.value}); setFormError(""); }}
                      className={inputCls}/>
                  </div>
                ))}

                <button onClick={handleSubmit} disabled={cargando}
                  className={`w-full text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${conMembresia?"bg-blue-500 hover:bg-blue-600":"bg-primary hover:bg-primaryHover"}`}>
                  {cargando ? "Procesando..." : "✅ Confirmar Pre-Reserva"}
                </button>

                {!estaLogueado && (
                  <p className="text-xs text-slate-400 text-center mt-2">
                    ¿Ya tienes cuenta?{" "}
                    <button onClick={()=>{cerrarModal();navigate("/auth");}} className="text-primary font-bold hover:underline">Inicia sesión</button>
                  </p>
                )}
                <button onClick={cerrarModal} className="w-full text-slate-400 text-sm mt-2 hover:text-slate-500 transition-colors py-2">Cancelar</button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✅</span></div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">¡Pre-Reserva Registrada!</h3>
                <p className="text-slate-400 text-sm mb-4">Lote <strong>{loteSeleccionado.id}</strong> reservado exitosamente.</p>
                {respuesta && (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-4 text-left">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-widest mb-1">Tu código de cliente</p>
                    <p className="text-2xl font-black text-green-700 dark:text-green-300 tracking-widest mb-1">{respuesta.codigoUsuario}</p>
                    <p className="text-xs text-slate-400">Guárdalo para consultar tu cuenta.</p>
                  </div>
                )}
                <button onClick={cerrarModal} className="w-full bg-primary text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-primaryHover transition-colors">Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
