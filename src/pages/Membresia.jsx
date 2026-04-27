import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSwimmingPool, FaDumbbell, FaUtensils, FaChild,
  FaShower, FaWater, FaWhatsapp, FaCheckCircle, FaTimesCircle,
  FaStar, FaUsers, FaInfinity, FaCreditCard, FaCalendarAlt, FaCalculator,
  FaRunning,
} from "react-icons/fa";
import { MdPool } from "react-icons/md";
import { comprarMembresia } from "../services/api";

const WA_PHONE = "59171295179";

const PLANES = [
  {
    id: "basica",
    nombre: "Membresía Básica",
    precioTotal: 500,
    personas: 2,
    color: "border-slate-200",
    badgeColor: "",
    beneficios: [
      "Acceso al Parque Acuático",
      "2 personas incluidas",
      "Válida de por vida",
      "Piscinas y áreas verdes",
      "Parques infantiles",
    ],
    noIncluye: ["Deportes extremos", "Salón de eventos VIP"],
  },
  {
    id: "familiar",
    nombre: "Membresía Familiar",
    precioTotal: 800,
    personas: 5,
    color: "border-primary",
    badgeColor: "bg-primary text-white",
    badge: "Más popular",
    beneficios: [
      "Acceso al Parque Acuático",
      "5 personas incluidas",
      "Válida de por vida",
      "Piscinas y áreas verdes",
      "Parques infantiles",
      "Canchas deportivas",
      "Patio de comidas",
      "Gimnasio",
    ],
    noIncluye: [],
  },
  {
    id: "premium",
    nombre: "Membresía Premium",
    precioTotal: 1200,
    personas: 8,
    color: "border-yellow-400",
    badgeColor: "bg-yellow-400 text-green-900",
    badge: "Todo incluido",
    beneficios: [
      "Acceso al Parque Acuático",
      "8 personas incluidas",
      "Válida de por vida",
      "Piscinas y áreas verdes",
      "Parques infantiles",
      "Canchas deportivas",
      "Patio de comidas",
      "Gimnasio",
      "Deportes extremos",
      "Salón de eventos VIP",
      "Cascada artificial",
    ],
    noIncluye: [],
  },
];

const AMENIDADES = [
  { icon: <MdPool size={28} />,         label: "Piscina de Niños"    },
  { icon: <FaSwimmingPool size={24} />, label: "Piscina de Adultos"  },
  { icon: <FaShower size={24} />,       label: "Vestidores Privados" },
  { icon: <FaWater size={24} />,        label: "Cascada Artificial"  },
  { icon: <FaRunning size={24} />,      label: "Deportes Extremos"   },
  { icon: <FaChild size={24} />,        label: "Parques Infantiles"  },
  { icon: <FaUtensils size={22} />,     label: "Patio de Comidas"    },
  { icon: <FaDumbbell size={24} />,       label: "Gimnasio"            },
];

const OPCIONES_CUOTAS = [1, 3, 6, 12, 18, 24];

export default function Membresia() {
  const navigate = useNavigate();
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [numCuotas, setNumCuotas]   = useState(6);
  // Pre-llenar todos los datos del usuario logueado
  const datosUsuario = () => ({
    nombre:          localStorage.getItem("user_nombre") || "",
    ci:              localStorage.getItem("user_ci") || "",
    telefono:        localStorage.getItem("user_telefono") || "",
    email:           localStorage.getItem("user_email") || "",
    fechaNacimiento: localStorage.getItem("user_fechaNac") || "",
  });
  const [form, setForm] = useState(datosUsuario());
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [enviado, setEnviado]       = useState(false);
  const [respuesta, setRespuesta]   = useState(null);
  const [error, setError]           = useState("");
  const [cargando, setCargando]     = useState(false);

  const cuotaMensual = planSeleccionado
    ? Math.ceil(planSeleccionado.precioTotal / numCuotas)
    : 0;

  const seleccionarPlan = (plan) => {
    setPlanSeleccionado(plan);
    setEnviado(false);
    setRespuesta(null);
    setError("");
    setCargando(false);
    // Mantener datos del usuario logueado, no resetear
    setForm(datosUsuario());
    // Inicializar slots de beneficiarios vacíos según el plan
    const slots = Array.from({ length: plan.personas - 1 }, () => ({
      nombre: "", ci: "", fechaNacimiento: ""
    }));
    setBeneficiarios(slots);
    setTimeout(() => {
      document.getElementById("form-membresia")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSubmit = async () => {
    const { nombre, telefono, ci, fechaNacimiento } = form;
    if (!nombre || !telefono || !ci || !fechaNacimiento) {
      setError("Completa todos los campos obligatorios del titular.");
      return;
    }
    // Validar beneficiarios
    for (const [i, b] of beneficiarios.entries()) {
      if (!b.nombre || !b.ci || !b.fechaNacimiento) {
        setError(`Completa todos los datos del beneficiario ${i + 1}.`);
        return;
      }
    }
    setError("");
    setCargando(true);
    try {
      const resultado = await comprarMembresia({
        nombre,
        telefono,
        ci,
        fechaNacimiento,
        email: form.email,
        plan: planSeleccionado.nombre,
        cuotas: numCuotas,
        beneficiarios,
      });
      setRespuesta(resultado);
      setEnviado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="currentColor" className="text-gray-50 dark:text-slate-900" />
        </svg>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 md:py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-5">
            <MdPool size={14} /> Parque Acuático Bermejo
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-lg leading-tight">
            MEMBRESÍA DE POR VIDA
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto mb-5">
            Acceso ilimitado para toda tu familia en <strong className="text-yellow-300">Bermejo, Tarija</strong>. Paga en cuotas cómodas.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 rounded-full px-4 py-1.5 text-xs font-bold">
            <FaInfinity /> MEMBRESÍA DE POR VIDA · Sin cuotas mensuales extras
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-12">

        {/* ── AMENIDADES ── */}
        <div className="text-center mb-8">
          <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-2">El Parque</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2">TODO EN UN SOLO LUGAR</h2>
          <p className="text-slate-400 dark:text-slate-300 text-sm">Bermejo, Tarija · Abierto todo el año</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {AMENIDADES.map((a, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-600 rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex justify-center text-primary mb-2">{a.icon}</div>
              <p className="text-slate-600 dark:text-slate-300 font-semibold text-xs">{a.label}</p>
            </div>
          ))}
        </div>

        {/* ── PLANES ── */}
        <div className="text-center mb-8">
          <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-2">Planes</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2">ELIGE TU MEMBRESÍA</h2>
          <p className="text-slate-400 dark:text-slate-300 text-sm">Pago único o en cuotas · Válida de por vida · Sin costos adicionales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {PLANES.map((plan) => {
            const sel = planSeleccionado?.id === plan.id;
            return (
              <div key={plan.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-200
                  ${sel ? "border-primary shadow-xl scale-[1.02]" : "border-black dark:border-slate-600"}`}>
                {plan.badge && (
                  <div className={`${plan.badgeColor} text-center py-2`}>
                    <span className="text-xs font-black tracking-wider">{plan.badge}</span>
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-1">{plan.nombre}</h3>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-black text-primary">${plan.precioTotal}</span>
                    <span className="text-slate-400 dark:text-slate-300 text-xs mb-1">total</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-300 mb-4">
                    <FaUsers className="text-primary" />
                    <span>Hasta <strong>{plan.personas} personas</strong> · De por vida</span>
                  </div>
                  <div className="space-y-1.5 mb-5">
                    {plan.beneficios.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" size={12} />
                        {b}
                      </div>
                    ))}
                    {plan.noIncluye.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <FaTimesCircle className="flex-shrink-0" size={12} />
                        {b}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => seleccionarPlan(plan)}
                    className={`w-full font-bold py-2.5 rounded-xl text-sm transition-all
                      ${sel
                        ? "bg-primary text-white shadow-md"
                        : plan.id === "familiar"
                          ? "bg-primary hover:bg-primaryHover text-white"
                          : "bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-200"}`}>
                    {sel ? "✓ Seleccionado" : "Seleccionar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FORMULARIO ── */}
        <div id="form-membresia" className="scroll-mt-20">
          {!planSeleccionado ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-black dark:border-slate-600 shadow-sm p-8 text-center">
              <div className="flex justify-center text-slate-300 mb-4"><FaStar size={40} /></div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">SELECCIONA UN PLAN ARRIBA</h3>
              <p className="text-slate-400 dark:text-slate-300 text-sm">Elige el plan que mejor se adapte a tu familia.</p>
            </div>
          ) : !enviado ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-black dark:border-slate-600 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-5 text-white">
                <p className="text-white/75 text-xs uppercase tracking-widest font-semibold mb-1">Plan seleccionado</p>
                <h3 className="text-xl font-black">{planSeleccionado.nombre}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/80">
                  <span className="flex items-center gap-1"><FaUsers size={12} /> {planSeleccionado.personas} personas</span>
                  <span className="flex items-center gap-1"><FaInfinity size={12} /> De por vida</span>
                  <span className="bg-white/20 px-3 py-0.5 rounded-full text-white font-black text-xs">${planSeleccionado.precioTotal} total</span>
                </div>
              </div>

              <div className="p-6 md:p-8">

                {/* Calculadora de cuotas */}
                <div className="bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaCalculator className="text-primary" />
                    <h4 className="font-black text-slate-800 dark:text-white text-sm">Elige tu plan de pago</h4>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                    {OPCIONES_CUOTAS.map(n => (
                      <button key={n} onClick={() => setNumCuotas(n)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border
                          ${numCuotas === n
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-white dark:bg-slate-600 text-slate-500 dark:text-slate-300 border-gray-200 dark:border-slate-500 hover:border-primary hover:text-primary"}`}>
                        {n === 1 ? "Contado" : `${n} meses`}
                      </button>
                    ))}
                  </div>
                  {/* Resumen */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-slate-600 rounded-xl p-3 text-center border border-gray-100 dark:border-slate-500">
                      <p className="text-xs text-slate-400 dark:text-slate-300 mb-1 flex items-center justify-center gap-1">
                        <FaCreditCard size={10} /> Cuota mensual
                      </p>
                      <p className="text-xl font-black text-primary">${cuotaMensual}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-600 rounded-xl p-3 text-center border border-gray-100 dark:border-slate-500">
                      <p className="text-xs text-slate-400 dark:text-slate-300 mb-1 flex items-center justify-center gap-1">
                        <FaCalendarAlt size={10} /> N° cuotas
                      </p>
                      <p className="text-xl font-black text-slate-700 dark:text-white">{numCuotas}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-600 rounded-xl p-3 text-center border border-gray-100 dark:border-slate-500">
                      <p className="text-xs text-slate-400 dark:text-slate-300 mb-1 flex items-center justify-center gap-1">
                        <FaInfinity size={10} /> Total
                      </p>
                      <p className="text-xl font-black text-slate-700 dark:text-white">${planSeleccionado.precioTotal}</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-black text-slate-800 dark:text-white text-sm mb-4">Datos del titular</h4>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-4">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { key: "nombre",          type: "text",  ph: "Nombre completo *",    label: null,                    span: "sm:col-span-2" },
                    { key: "ci",              type: "text",  ph: "Carnet de identidad *", label: null,                    span: "" },
                    { key: "fechaNacimiento", type: "date",  ph: "",                       label: "Fecha de nacimiento *", span: "" },
                    { key: "telefono",        type: "text",  ph: "WhatsApp / Teléfono *", label: null,                    span: "" },
                    { key: "email",           type: "email", ph: "Correo electrónico",    label: null,                    span: "" },
                  ].map(f => (
                    <div key={f.key} className={f.span}>
                      {f.label && (
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1">
                          {f.label}
                        </label>
                      )}
                      <input type={f.type} placeholder={f.ph} value={form[f.key]}
                        onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setError(""); }}
                        className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Beneficiarios */}
                {beneficiarios.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-black text-slate-800 dark:text-white text-sm mb-3">
                      Beneficiarios ({beneficiarios.length} personas adicionales)
                    </h4>
                    {beneficiarios.map((b, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 mb-3">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-300 mb-2 uppercase tracking-widest">
                          Beneficiario {i + 1}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input type="text" placeholder="Nombre completo *"
                            value={b.nombre}
                            onChange={e => {
                              const arr = [...beneficiarios];
                              arr[i] = { ...arr[i], nombre: e.target.value };
                              setBeneficiarios(arr);
                              setError("");
                            }}
                            className="border border-gray-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
                          <input type="text" placeholder="CI *"
                            value={b.ci}
                            onChange={e => {
                              const arr = [...beneficiarios];
                              arr[i] = { ...arr[i], ci: e.target.value };
                              setBeneficiarios(arr);
                              setError("");
                            }}
                            className="border border-gray-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
                          <div>
                            <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">Fecha de nacimiento *</label>
                          <input type="date" placeholder=""
                            value={b.fechaNacimiento}
                            onChange={e => {
                              const arr = [...beneficiarios];
                              arr[i] = { ...arr[i], fechaNacimiento: e.target.value };
                              setBeneficiarios(arr);
                              setError("");
                            }}
                            className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleSubmit} disabled={cargando}
                    className="flex-1 bg-primary hover:bg-primaryHover text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {cargando ? "Procesando..." : "✅ Confirmar Membresía"}
                  </button>
                  <button onClick={() => setPlanSeleccionado(null)}
                    className="sm:w-auto text-slate-400 dark:text-slate-300 text-sm px-5 py-3.5 rounded-xl border border-gray-200 dark:border-slate-600 hover:border-slate-300 transition-colors">
                    Cambiar plan
                  </button>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 text-center mt-3">
                  Al confirmar, recibirás tu código de cliente único y las instrucciones de pago.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">¡Membresía Registrada!</h3>
              <p className="text-slate-400 dark:text-slate-300 text-sm mb-5">
                {planSeleccionado.nombre} · {numCuotas} cuota{numCuotas > 1 ? "s" : ""} de ${cuotaMensual}/mes
              </p>

              {respuesta && (
                <>
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-5 mb-4 text-left">
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest mb-1">Tu código de cliente</p>
                    <p className="text-3xl font-black text-green-700 dark:text-green-300 tracking-widest mb-2">
                      {respuesta.titular?.codigoUsuario}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Guárdalo — lo necesitarás para consultar tu cuenta.</p>
                  </div>

                  {respuesta.beneficiarios?.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-4 text-left">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-2">Códigos de beneficiarios</p>
                      {respuesta.beneficiarios.map((b, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-blue-100 dark:border-blue-800 last:border-0">
                          <span className="text-sm text-slate-600 dark:text-slate-300">{b.nombre}</span>
                          <span className="text-sm font-black text-blue-700 dark:text-blue-300 tracking-wider">{b.codigoUsuario}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-5 text-left">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold uppercase tracking-widest mb-1">Instrucciones de pago</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Monto: ${respuesta.titular?.precioTotal?.toLocaleString()} · {respuesta.titular?.numCuotas} cuota{respuesta.titular?.numCuotas > 1 ? "s" : ""} de ${respuesta.titular?.montoCuota}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{respuesta.instruccionesPago?.nota}</p>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => { setPlanSeleccionado(null); setEnviado(false); setRespuesta(null); }}
                  className="bg-primary text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-primaryHover transition-colors">
                  Nueva membresía
                </button>
                <Link to="/lotes?vista=grilla"
                  className="border border-gray-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold px-8 py-3 rounded-xl text-sm hover:border-primary hover:text-primary transition-colors text-center">
                  Ver lotes disponibles
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* CTA lote + membresía */}
        <div className="mt-12 bg-gradient-to-br from-green-700 to-emerald-500 rounded-3xl p-7 md:p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 rounded-3xl" />
          <div className="relative z-10">
            <p className="text-emerald-200 text-xs font-bold tracking-widest uppercase mb-3">Oferta combinada</p>
            <h3 className="text-xl md:text-2xl font-black mb-3">¿YA TIENES UN LOTE EN PLAYA CAÑAVERAL?</h3>
            <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
              Al reservar tu lote en <strong>Bermejo</strong>, la membresía familiar está incluida de por vida.
            </p>
            <Link to="/lotes"
              className="inline-block bg-white text-green-800 font-black px-8 py-3 rounded-full shadow-lg hover:bg-emerald-50 transition-all hover:scale-105 text-sm">
              Ver lotes con membresía incluida →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
