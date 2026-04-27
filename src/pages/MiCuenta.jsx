import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaSearch, FaWhatsapp, FaCheckCircle, FaClock, FaHome,
  FaUsers, FaInfinity, FaCreditCard, FaFileAlt, FaArrowLeft,
  FaSpinner, FaQrcode, FaMobileAlt, FaUpload, FaCheck, FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdPool } from "react-icons/md";
import { obtenerMiCuenta, subirComprobanteQR, iniciarPagoMP } from "../services/api";
import SelectorCuotas from "../components/SelectorCuotas";

const WA = "59171295179";
const QR_IMAGE_URL = "/fotos/qr_pago.png";

function BarraProgreso({ pagadas, total, color = "naranja" }) {
  const pct = total > 0 ? Math.round((pagadas / total) * 100) : 0;
  const gradient = pagadas === total
    ? "linear-gradient(90deg,#2ecc71,#27ae60)"
    : color === "azul"   ? "linear-gradient(90deg,#3b82f6,#06b6d4)"
    : color === "verde"  ? "linear-gradient(90deg,#2ecc71,#27ae60)"
    : "linear-gradient(90deg,#f5a623,#e67e22)";
  return (
    <div>
      <div className="flex justify-between text-xs text-white/70 mb-1.5">
        <span>Progreso</span><span className="font-bold">{pct}%</span>
      </div>
      <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
        <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: gradient }} />
      </div>
    </div>
  );
}

function TablaHistorial({ historial }) {
  if (!historial || historial.length === 0) return (
    <p className="text-slate-400 text-xs text-center py-4">Sin historial aún</p>
  );
  return (
    <div className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="max-h-52 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0">
            <tr>
              {["N°","Vencimiento","Monto","Estado"].map(h => (
                <th key={h} className={`px-3 py-2 text-slate-400 dark:text-slate-300 font-semibold ${h==="Monto"||h==="Estado" ? "text-right":"text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historial.map((h, i) => (
              <tr key={i} className={i%2===0?"bg-white dark:bg-slate-800":"bg-slate-50/50 dark:bg-slate-700/50"}>
                <td className="px-3 py-2 text-slate-500 dark:text-slate-300">{h.numero_cuota}</td>
                <td className="px-3 py-2 text-slate-500 dark:text-slate-300">
                  {h.fecha_vencimiento ? new Date(h.fecha_vencimiento).toLocaleDateString("es-BO") : "—"}
                </td>
                <td className="px-3 py-2 text-right font-bold text-slate-700 dark:text-slate-200">${Number(h.monto).toLocaleString()}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-xs
                    ${h.estado==="pagado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {h.estado==="pagado" ? <FaCheckCircle size={9}/> : <FaClock size={9}/>}
                    {h.estado==="pagado" ? "Pagado" : "Pendiente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PanelPago({ cuota, codigoUsuario, tipo = "lote", onPagoEnviado }) {
  const [metodo, setMetodo]           = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [cargandoMP, setCargandoMP]   = useState(false);
  const [cargandoQR, setCargandoQR]   = useState(false);
  const [enviado, setEnviado]         = useState(false);
  const [error, setError]             = useState("");
  const fileRef = useRef();

  const handleArchivo = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setNombreArchivo(file.name);
    const reader = new FileReader();
    reader.onload = () => setComprobante(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePagoMP = async () => {
    setCargandoMP(true); setError("");
    try {
      const res = await iniciarPagoMP({ cuotaId: cuota.id, codigoUsuario });
      window.location.href = res.sandbox_init_point || res.init_point;
    } catch (err) { setError(err.message); setCargandoMP(false); }
  };

  const handleEnviarComprobante = async () => {
    if (!comprobante) { setError("Debes subir el comprobante primero."); return; }
    setCargandoQR(true); setError("");
    try {
      await subirComprobanteQR({ cuotaId: cuota.id, codigoUsuario, comprobante });
      setEnviado(true); onPagoEnviado();
    } catch (err) { setError(err.message); }
    finally { setCargandoQR(false); }
  };

  const colorTipo = tipo === "membresia" ? "from-blue-500 to-cyan-400" : "from-green-700 to-emerald-500";

  if (enviado) return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-2xl p-5 text-center">
      <FaClock className="text-yellow-500 mx-auto mb-2" size={28}/>
      <p className="font-black text-yellow-800 dark:text-yellow-300 text-base mb-1">Comprobante enviado</p>
      <p className="text-yellow-700 dark:text-yellow-400 text-sm">Un administrador verificará y activará tu cuota en breve.</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <FaCreditCard className="text-primary"/>
        <h3 className="font-black text-slate-800 dark:text-white text-sm">
          PAGAR CUOTA N° {cuota.numero_cuota}
          <span className="ml-2 text-xs font-normal text-slate-400">({tipo === "membresia" ? "Membresía" : "Lote"})</span>
        </h3>
      </div>
      <p className="text-slate-400 dark:text-slate-300 text-xs mb-4">Monto: <strong className="text-primary text-sm">${Number(cuota.monto).toLocaleString()}</strong></p>

      {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600 dark:text-red-400 text-xs rounded-xl px-4 py-3 mb-3">{error}</div>}

      {!metodo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => setMetodo("mp")}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left">
            <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">MP</span>
            </div>
            <div>
              <p className="font-black text-slate-800 dark:text-white text-sm">Mercado Pago</p>
              <p className="text-xs text-slate-400 dark:text-slate-300">Automático · Tarjeta / débito</p>
            </div>
          </button>
          <button onClick={() => setMetodo("qr")}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-left">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <FaQrcode className="text-white" size={20}/>
            </div>
            <div>
              <p className="font-black text-slate-800 dark:text-white text-sm">QR Banca Móvil</p>
              <p className="text-xs text-slate-400 dark:text-slate-300">Tigo Money / Banco</p>
            </div>
          </button>
        </div>
      )}

      {metodo === "mp" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <p className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-1">Mercado Pago</p>
          <p className="text-blue-700 dark:text-blue-400 text-xs mb-4">Al completar el pago tu cuota se actualizará automáticamente.</p>
          <div className="flex gap-2">
            <button onClick={handlePagoMP} disabled={cargandoMP}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
              {cargandoMP ? <FaSpinner className="animate-spin" size={14}/> : <FaMobileAlt size={14}/>}
              {cargandoMP ? "Redirigiendo..." : `Pagar $${Number(cuota.monto).toLocaleString()}`}
            </button>
            <button onClick={() => setMetodo(null)} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-slate-400 text-sm">Volver</button>
          </div>
        </div>
      )}

      {metodo === "qr" && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
            <p className="text-green-800 dark:text-green-300 font-bold text-sm mb-3 text-center">
              Escanea y transfiere exactamente <strong>${Number(cuota.monto).toLocaleString()}</strong>
            </p>
            <div className="flex justify-center mb-3">
              <div className="bg-white p-3 rounded-xl border-2 border-green-300 shadow-md inline-block">
                <img src={QR_IMAGE_URL} alt="QR" className="w-44 h-44 object-contain"
                  onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
                <div style={{display:"none"}} className="w-44 h-44 bg-slate-100 dark:bg-slate-700 rounded-lg flex-col items-center justify-center gap-2">
                  <FaQrcode size={48} className="text-slate-300"/>
                  <p className="text-xs text-slate-400 text-center px-2">Pon tu QR en<br/><code>/public/fotos/qr_pago.png</code></p>
                </div>
              </div>
            </div>
          </div>

          <div className={`border-2 rounded-xl p-4 transition-colors ${comprobante ? "border-green-400 bg-green-50 dark:bg-green-900/10" : "border-dashed border-gray-200 dark:border-slate-600"}`}>
            <div className="flex items-center gap-2 mb-2">
              {!comprobante && <FaLock className="text-slate-400" size={12}/>}
              <p className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">
                {comprobante ? "Comprobante listo ✓" : "Sube el comprobante para confirmar"}
              </p>
            </div>
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleArchivo} className="hidden"/>
            {!comprobante ? (
              <>
                <p className="text-slate-400 text-xs mb-3">El botón se habilitará una vez subas la foto del comprobante.</p>
                <button onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 transition-colors text-slate-500 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-600">
                  <FaUpload size={14}/> Subir foto o PDF del comprobante
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500 flex-shrink-0" size={14}/>
                <span className="text-green-700 dark:text-green-400 text-xs flex-1 truncate font-semibold">{nombreArchivo}</span>
                <button onClick={() => { setComprobante(null); setNombreArchivo(""); }} className="text-slate-400 hover:text-red-400 text-xs px-2">✕</button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={handleEnviarComprobante}
              disabled={!comprobante || cargandoQR}
              className={`flex-1 font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2
                ${comprobante ? "bg-primary hover:bg-primaryHover text-white cursor-pointer" : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"}`}>
              {cargandoQR ? <FaSpinner className="animate-spin" size={14}/> : comprobante ? <FaCheck size={14}/> : <FaLock size={14}/>}
              {cargandoQR ? "Enviando..." : comprobante ? "Enviar para verificación" : "Sube el comprobante primero"}
            </button>
            <button onClick={() => { setMetodo(null); setComprobante(null); setNombreArchivo(""); }}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-slate-400 dark:text-slate-300 text-sm">
              Volver
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">Un admin verificará y activará tu cuota en breve.</p>
        </div>
      )}
    </div>
  );
}

function SeccionLote({ lote, cuotasLote, codigoUsuario, onRefresh }) {
  const total   = cuotasLote.length;
  const pagadas = cuotasLote.filter(c => c.estado === "pagado").length;
  const pend    = total - pagadas;
  const monto   = total > 0 ? Number(cuotasLote[0].monto) : 0;
  const proxima = cuotasLote.find(c => c.estado === "pendiente");

  return (
    <div className="mb-6">
      {/* Header lote */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-500 rounded-2xl p-5 text-white mb-4">
        <div className="flex items-center gap-2 mb-1">
          <FaHome size={18}/>
          <h3 className="font-black text-base">LOTE {lote.codigo_lote}</h3>
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-white/20">
            {pagadas === total && total > 0 ? "✓ Pagado" : lote.estado === "reservado" ? "Reservado" : lote.estado}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-white/80 text-xs mb-4">
          <span className="flex items-center gap-1"><FaMapMarkerAlt size={10}/> Manzana {lote.manzana} · Bermejo</span>
          <span>{lote.superficie} m²</span>
          <span className="flex items-center gap-1"><FaCreditCard size={10}/> ${monto.toLocaleString()}/cuota</span>
        </div>
        {total > 0 && <BarraProgreso pagadas={pagadas} total={total} color="verde"/>}
        {total === 0 && (
          <p className="text-white/70 text-xs mt-2">Las cuotas se generarán al confirmar tu reserva con un asesor.</p>
        )}
      </div>

      {/* Resumen financiero lote */}
      {total > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <FaCreditCard className="text-primary"/>
            <h3 className="font-black text-slate-800 dark:text-white text-sm">CUOTAS DEL LOTE</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Pagadas",   val: pagadas, color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20" },
              { label: "Restantes", val: pend,    color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
              { label: "Total",     val: total,   color: "text-slate-700 dark:text-slate-200", bg: "bg-slate-50 dark:bg-slate-700" },
              { label: "Por cuota", val: `$${monto.toLocaleString()}`, color: "text-primary", bg: "bg-primary/5 dark:bg-primary/10" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-xl py-3 px-2 text-center`}>
                <p className={`text-lg md:text-xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { label: "Precio total del lote",  val: `$${Number(lote.precio).toLocaleString()}`,         color: "text-slate-700 dark:text-slate-200" },
              { label: "Total pagado",            val: `$${(pagadas * monto).toLocaleString()}`,           color: "text-green-600" },
              { label: "Saldo pendiente",         val: `$${(pend * monto).toLocaleString()}`,             color: "text-orange-500" },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700 last:border-0">
                <span className="text-xs text-slate-400 dark:text-slate-300">{r.label}</span>
                <span className={`text-sm font-black ${r.color}`}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel de pago cuota lote */}
      {proxima && (
        <div className="mb-4">
          <PanelPago cuota={proxima} codigoUsuario={codigoUsuario} tipo="lote" onPagoEnviado={onRefresh}/>
        </div>
      )}

      {/* Historial cuotas lote */}
      {total > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <FaFileAlt className="text-primary"/>
            <h3 className="font-black text-slate-800 dark:text-white text-sm">HISTORIAL DE CUOTAS — LOTE</h3>
          </div>
          <TablaHistorial historial={cuotasLote}/>
        </div>
      )}
    </div>
  );
}

function SeccionMembresia({ usuario, cuotas, beneficiarios, codigoUsuario, onRefresh }) {
  const memEstado  = usuario?.estado_membresia ?? "pendiente";
  const memPlan    = usuario?.plan ?? "—";
  const memPrecio  = Number(usuario?.precio_total) || 0;
  const memMonto   = Number(usuario?.monto_cuota) || 0;
  const pagadas    = cuotas.filter(c => c.estado === "pagado").length;
  const pend       = cuotas.length - pagadas;
  const completo   = cuotas.length > 0 && pagadas === cuotas.length;
  const proxima    = cuotas.find(c => c.estado === "pendiente");

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-5 text-white mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MdPool size={20}/>
          <h3 className="font-black text-base">{memPlan}</h3>
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-white/20">
            {completo ? "✓ Pagada" : "En curso"}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-white/80 text-xs mb-4">
          <span className="flex items-center gap-1"><FaUsers size={10}/> {beneficiarios.length} beneficiarios</span>
          <span className="flex items-center gap-1"><FaInfinity size={10}/> De por vida</span>
          <span className="flex items-center gap-1"><FaCreditCard size={10}/> ${memMonto}/cuota</span>
        </div>
        <BarraProgreso pagadas={pagadas} total={cuotas.length || 1} color="azul"/>
      </div>

      {proxima && (
        <div className="mb-4">
          <PanelPago cuota={proxima} codigoUsuario={codigoUsuario} tipo="membresia" onPagoEnviado={onRefresh}/>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <FaCreditCard className="text-primary"/>
          <h3 className="font-black text-slate-800 dark:text-white text-sm">RESUMEN MEMBRESÍA</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Pagadas",   val: pagadas,              color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20" },
            { label: "Restantes", val: pend,                 color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
            { label: "Total",     val: cuotas.length,        color: "text-slate-700 dark:text-slate-200", bg: "bg-slate-50 dark:bg-slate-700" },
            { label: "Por cuota", val: `$${memMonto}`,       color: "text-primary",    bg: "bg-primary/5 dark:bg-primary/10" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl py-3 px-2 text-center`}>
              <p className={`text-lg md:text-xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { label: "Precio total",    val: `$${memPrecio.toLocaleString()}`,              color: "text-slate-700 dark:text-slate-200" },
            { label: "Total pagado",    val: `$${(pagadas * memMonto).toLocaleString()}`,   color: "text-green-600" },
            { label: "Saldo pendiente", val: `$${(pend * memMonto).toLocaleString()}`,     color: "text-orange-500" },
          ].map((r, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700 last:border-0">
              <span className="text-xs text-slate-400 dark:text-slate-300">{r.label}</span>
              <span className={`text-sm font-black ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {cuotas.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <FaFileAlt className="text-primary"/>
            <h3 className="font-black text-slate-800 dark:text-white text-sm">HISTORIAL — MEMBRESÍA</h3>
          </div>
          <TablaHistorial historial={cuotas}/>
        </div>
      )}

      {beneficiarios.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdPool className="text-blue-500" size={18}/>
            <h3 className="font-black text-slate-800 dark:text-white text-sm">BENEFICIARIOS</h3>
          </div>
          {beneficiarios.map((b, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700 last:border-0">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{b.nombre}</p>
                <p className="text-xs text-slate-400">CI: {b.ci}</p>
              </div>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest">{b.codigo_usuario}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MiCuenta() {
  const [searchParams]          = useSearchParams();
  const [codigo, setCodigo]     = useState(searchParams.get("codigo") || localStorage.getItem("user_codigo") || "");
  const [datos, setDatos]       = useState(null);
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);
  const pagoEstado              = searchParams.get("pago");

  // Auto-cargar si hay sesión activa
  useEffect(() => {
    const cod = localStorage.getItem("user_codigo");
    if (cod && !datos) buscar(cod);
  }, []);

  const buscar = async (cod) => {
    const c = (cod || codigo).trim().toUpperCase();
    if (!c) { setError("Ingresa tu código de cliente."); return; }
    setCargando(true); setError(""); setDatos(null);
    try { setDatos(await obtenerMiCuenta(c)); }
    catch { setError("Código no encontrado. Verifica el código que recibiste al registrarte."); }
    finally { setCargando(false); }
  };

  const limpiar = () => { setCodigo(""); setDatos(null); setError(""); };
  const onRefresh = () => buscar(codigo);

  const usuario       = datos?.usuario ?? null;
  const lote          = datos?.lote ?? null;
  const cuotasLote    = Array.isArray(datos?.cuotasLote) ? datos.cuotasLote : [];
  const cuotasMem     = Array.isArray(datos?.cuotas) ? datos.cuotas : [];
  const beneficiarios = Array.isArray(datos?.beneficiarios) ? datos.beneficiarios : [];

  const tieneLote      = !!lote;
  // Tiene membresía si hay cuotas de membresía O si el usuario tiene plan asignado
  const tieneMembresia = cuotasMem.length > 0 || !!usuario?.plan || !!usuario?.estado_membresia;

  const waMsg = usuario
    ? encodeURIComponent(`Hola, soy ${usuario.nombre} (código ${codigo.toUpperCase()}). Quisiera consultar sobre mi cuenta.`)
    : "";

  return (
    <main className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 md:px-10 py-7 md:py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-1">Mi Cuenta</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-1">SEGUIMIENTO DE CUENTA</h1>
          <p className="text-slate-400 dark:text-slate-300 text-sm">
            Condominio Playa Cañaveral · <strong className="text-slate-600 dark:text-slate-200">Bermejo, Tarija</strong>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">

        {pagoEstado === "exitoso" && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 rounded-2xl p-5 mb-5 flex items-center gap-3">
            <FaCheck className="text-green-500 flex-shrink-0" size={24}/>
            <div>
              <p className="font-black text-green-800 dark:text-green-300">¡Pago con Mercado Pago exitoso!</p>
              <p className="text-green-700 dark:text-green-400 text-sm">Tu cuota fue registrada automáticamente.</p>
            </div>
          </div>
        )}

        {/* BUSCADOR */}
        {!datos && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-black dark:border-slate-600 shadow-sm p-6 md:p-8 mb-6">
            <div className="text-center mb-7">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaSearch className="text-primary" size={28}/>
              </div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white mb-2">INGRESA TU CÓDIGO DE CLIENTE</h2>
              <p className="text-slate-400 dark:text-slate-300 text-sm mb-1">Tu código fue generado al momento de tu registro.</p>
              <p className="text-xs text-slate-300 dark:text-slate-500">Formato: DDMMAA + últimos 4 dígitos CI &nbsp;·&nbsp; Ej: <span className="font-mono font-bold">1709041948</span></p>
            </div>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Ej: 1909041948" value={codigo}
                onChange={e => { setCodigo(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={e => e.key === "Enter" && buscar()}
                className="flex-1 min-w-0 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors uppercase tracking-widest font-mono"/>
              <button onClick={() => buscar()} disabled={cargando}
                className="bg-primary hover:bg-primaryHover text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-60">
                {cargando ? <FaSpinner className="animate-spin" size={14}/> : <FaSearch size={12}/>}
                {cargando ? "Buscando..." : "Buscar"}
              </button>
            </div>
            {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-xl px-4 py-3 text-center">{error}</div>}
          </div>
        )}

        {/* RESULTADO */}
        {datos && usuario && (
          <>
            {/* Header cliente */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 md:p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaHome className="text-primary" size={20}/>
                </div>
                <div>
                  <p className="font-black text-slate-800 dark:text-white text-base">{usuario.nombre}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-300">
                    Código: <span className="font-mono font-bold text-primary tracking-widest">{usuario.codigo_usuario}</span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-300">CI: {usuario.ci} · {usuario.telefono}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {tieneLote && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">🏠 Lote {lote.codigo_lote}</span>
                )}
                {tieneMembresia && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">🏊 Membresía</span>
                )}
                <button onClick={limpiar}
                  className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-300 hover:text-slate-600 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600 transition-colors">
                  <FaArrowLeft size={10}/> Cambiar
                </button>
              </div>
            </div>

            {/* Sección Lote */}
            {tieneLote && (
              <SeccionLote
                lote={lote}
                cuotasLote={cuotasLote}
                codigoUsuario={codigo.toUpperCase()}
                onRefresh={onRefresh}
              />
            )}

            {/* Sección Membresía */}
            {tieneMembresia && (
              <SeccionMembresia
                usuario={usuario}
                cuotas={cuotasMem}
                beneficiarios={beneficiarios}
                codigoUsuario={codigo.toUpperCase()}
                onRefresh={onRefresh}
              />
            )}

            {/* Sin datos */}
            {!tieneLote && !tieneMembresia && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 text-center mb-5">
                <p className="text-slate-500 dark:text-slate-300 text-sm mb-2">No tienes lote ni membresía registrada aún.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                  <a href="/lotes" className="bg-primary hover:bg-primaryHover text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">🏠 Pre-Reservar un Lote</a>
                  <a href="/membresia" className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">🏊 Comprar Membresía</a>
                </div>
              </div>
            )}

            <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-2">
              <FaWhatsapp size={16}/> Consultar con un asesor
            </a>
          </>
        )}

        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1">
            <FaArrowLeft size={11}/> Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
