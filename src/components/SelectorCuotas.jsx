import { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa";
import { solicitarCuotas, miSolicitud } from "../services/api";

const OPCIONES = [6, 12, 18, 24, 30, 36];

export default function SelectorCuotas({ lote, onSolicitado }) {
  const [cuotas, setCuotas]           = useState(24);
  const [solicitud, setSolicitud]     = useState(null);
  const [cargando, setCargando]       = useState(true);
  const [enviando, setEnviando]       = useState(false);
  const [error, setError]             = useState("");
  const [exito, setExito]             = useState(false);

  const montoCuota = Math.ceil(Number(lote.precio) / cuotas);

  useEffect(() => {
    miSolicitud().then(s => { setSolicitud(s); setCargando(false); }).catch(() => setCargando(false));
  }, []);

  const enviar = async () => {
    setEnviando(true); setError("");
    try {
      const res = await solicitarCuotas({ numCuotas: cuotas });
      if (res.error) return setError(res.error);
      setExito(true);
      setSolicitud(res.solicitud);
      if (onSolicitado) onSolicitado();
    } catch (e) { setError(e.message); }
    finally { setEnviando(false); }
  };

  if (cargando) return <div className="flex justify-center py-4"><FaSpinner className="animate-spin text-primary" size={20}/></div>;

  // Ya tiene solicitud aprobada (ya hay cuotas generadas)
  if (solicitud?.estado === "aprobada") return null;

  // Solicitud pendiente
  if (solicitud?.estado === "pendiente") return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <FaClock className="text-yellow-500" size={18}/>
        <p className="font-black text-yellow-800 dark:text-yellow-300 text-sm">SOLICITUD ENVIADA</p>
      </div>
      <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-1">
        Solicitaste <strong>{solicitud.num_cuotas} cuotas</strong> de <strong>${Number(solicitud.monto_cuota).toLocaleString()}/mes</strong>
      </p>
      <p className="text-yellow-600 dark:text-yellow-500 text-xs">
        El administrador revisará tu solicitud y aprobará el plan pronto.
      </p>
    </div>
  );

  // Solicitud rechazada o sin solicitud — mostrar selector
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 mb-4">
      <p className="font-black text-slate-800 dark:text-white text-sm mb-1">ELIGE TU PLAN DE CUOTAS</p>
      <p className="text-slate-400 dark:text-slate-300 text-xs mb-4">
        Selecciona cuántas cuotas quieres para pagar tu lote. El administrador aprobará el plan.
      </p>

      {solicitud?.estado === "rechazada" && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 dark:text-red-400 text-xs rounded-xl px-4 py-3 mb-4">
          Tu solicitud anterior fue rechazada. Puedes enviar una nueva solicitud.
        </div>
      )}

      {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600 dark:text-red-400 text-xs rounded-xl px-4 py-3 mb-3">{error}</div>}

      {/* Grid de opciones */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        {OPCIONES.map(n => (
          <button key={n} onClick={() => setCuotas(n)}
            className={`py-3 rounded-xl text-xs font-bold transition-all border
              ${cuotas === n
                ? "bg-primary border-primary text-white shadow-md"
                : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-primary"}`}>
            {n === 1 ? "Contado" : `${n} meses`}
          </button>
        ))}
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Cuota mensual", val: `$${montoCuota.toLocaleString()}`, color: "text-primary" },
          { label: "N° de cuotas",  val: cuotas,                           color: "text-slate-700 dark:text-slate-200" },
          { label: "Total",         val: `$${Number(lote.precio).toLocaleString()}`, color: "text-slate-700 dark:text-slate-200" },
        ].map((s,i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 text-center">
            <p className={`text-lg font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {exito ? (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl px-4 py-3">
          <FaCheckCircle className="text-green-500" size={16}/>
          <p className="text-green-700 dark:text-green-400 text-sm font-semibold">Solicitud enviada. El admin la revisará pronto.</p>
        </div>
      ) : (
        <button onClick={enviar} disabled={enviando}
          className="w-full bg-primary hover:bg-primaryHover text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
          {enviando && <FaSpinner className="animate-spin" size={14}/>}
          {enviando ? "Enviando solicitud..." : `Solicitar ${cuotas} cuotas de $${montoCuota.toLocaleString()}/mes`}
        </button>
      )}
    </div>
  );
}
