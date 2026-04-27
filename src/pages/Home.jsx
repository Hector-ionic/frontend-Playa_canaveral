import { Link } from "react-router-dom";
import { useState } from "react";
import { useInView } from "../hooks/useAnimations";
import {
  FaMapMarkerAlt, FaCheckCircle, FaDollarSign, FaRuler,
  FaFileAlt, FaWhatsapp, FaInfinity, FaUsers, FaShieldAlt,
  FaStar, FaArrowRight,
} from "react-icons/fa";
import { MdPool } from "react-icons/md";

// ── Carrusel lateral ─────────────────────────────────────────
const FOTOS_HERO = [
  "/fotos/Area_Verde.jpeg", "/fotos/Area_Verde1.jpeg",
  "/fotos/Area_Verde2.jpeg", "/fotos/Area_Verde3.jpeg",
  "/fotos/Area_Verde4.jpeg", "/fotos/Area_Verde5.jpeg",
];

function repetir(arr, n = 8) {
  const r = []; while (r.length < n) r.push(...arr); return r.slice(0, n);
}
function ColumnaCarrusel({ direction }) {
  const items = repetir(FOTOS_HERO, 8);
  const todas = [...items, ...items];
  return (
    <div className="h-full overflow-hidden relative w-full">
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-green-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-green-900 to-transparent z-10 pointer-events-none" />
      <div className="flex flex-col gap-3" style={{ animation: `car-${direction} 25s linear infinite` }}>
        {todas.map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden flex-shrink-0 w-full aspect-[4/5]">
            <img src={src} alt="" draggable={false} className="w-full h-full object-cover opacity-80 select-none" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes car-up   { from{transform:translateY(0)}    to{transform:translateY(-50%)} }
        @keyframes car-down { from{transform:translateY(-50%)} to{transform:translateY(0)}    }
      `}</style>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }) {
  const { inView, ref } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>{children}</div>
  );
}

function Stat({ valor, suffix = "", label, sublabel, amarillo }) {
  return (
    <div className="text-center">
      <p className={`text-2xl md:text-3xl lg:text-4xl font-black drop-shadow ${amarillo ? "text-yellow-300" : "text-white"}`}>
        {valor}{suffix}
      </p>
      <p className="text-xs md:text-sm text-white/80 mt-1 font-medium">{label}</p>
      {sublabel && <p className="text-xs text-emerald-300 mt-0.5 font-semibold hidden sm:block">{sublabel}</p>}
    </div>
  );
}

const AMENIDADES = [
  { img: "/fotos/Piscina.png",     titulo: "PISCINA & PARQUE ACUÁTICO", desc: "Membresía vitalicia para 5 personas incluida con tu lote. Diversión sin límites todo el año.",          badge: "Incluido gratis",  badgeColor: "bg-yellow-400 text-green-900" },
  { img: "/fotos/AriasVer.png",    titulo: "AREAS VERDES NATURALES",    desc: "Espacios abiertos con naturaleza exuberante para que tu familia respire aire puro.",                     badge: "Exclusivo",        badgeColor: "bg-primary text-white"       },
  { img: "/fotos/Canchas.png",     titulo: "CANCHAS DEPORTIVAS",        desc: "Fútbol, básquet y más. Canchas de primer nivel para toda la familia.",                                   badge: "Deporte",          badgeColor: "bg-blue-500 text-white"      },
  { img: "/fotos/ParqueInf.png",   titulo: "PARQUES INFANTILES",        desc: "Espacios diseñados especialmente para los más pequeños del hogar.",                                      badge: "Familias",         badgeColor: "bg-pink-500 text-white"      },
  { img: "/fotos/Seg.png",         titulo: "SEGURIDAD 24/7",            desc: "Control de acceso permanente y vigilancia día y noche para tu tranquilidad.",                            badge: "Protección",       badgeColor: "bg-slate-700 text-white"     },
  { img: "/fotos/AreaPav.png",     titulo: "VÍAS PAVIMENTADAS",         desc: "Calles internas asfaltadas, bien iluminadas y estacionamientos para todos.",                            badge: "Infraestructura",  badgeColor: "bg-slate-500 text-white"     },
  { img: "/fotos/img10.jpeg",   titulo: "SALÓN DE EVENTOS",          desc: "Espacios amplios para celebrar con familia y amigos dentro del condominio.",                             badge: "Eventos",          badgeColor: "bg-purple-500 text-white"    },
  { img: "/fotos/img8.jpeg",    titulo: "PATIO DE COMIDAS",          desc: "Variedad de opciones gastronómicas a pasos de tu hogar.",                                               badge: "Gastronomía",      badgeColor: "bg-orange-500 text-white"    },
  { img: "/fotos/ServBas.png",     titulo: "LUZ Y AGUA INCLUIDOS",      desc: "Red de agua potable y energía eléctrica disponible en cada lote.",                                      badge: "Servicios",        badgeColor: "bg-cyan-500 text-white"      },
];

function SeguimientoCuotas() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(false);
  const DEMO = {
    "PC-001": { nombre: "Juan Pérez",   lote: "A-01", totalCuotas: 24, pagadas: 8,  monto: 150 },
    "PC-002": { nombre: "María García", lote: "B-03", totalCuotas: 36, pagadas: 22, monto: 100 },
    "PC-003": { nombre: "Carlos Rojas", lote: "C-05", totalCuotas: 12, pagadas: 12, monto: 300 },
    "PC-004": { nombre: "Ana Mamani",   lote: "D-02", totalCuotas: 24, pagadas: 1,  monto: 150 },
  };
  const buscar = () => {
    const c = DEMO[codigo.toUpperCase().trim()];
    if (!c) { setError(true); setResultado(null); return; }
    setError(false); setResultado(c);
  };
  const pct = resultado ? Math.round((resultado.pagadas / resultado.totalCuotas) * 100) : 0;
  const completado = resultado?.pagadas === resultado?.totalCuotas;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-black dark:border-slate-600 shadow-sm p-5 md:p-8 max-w-xl mx-auto">
      <div className="text-center mb-5">
        <div className="flex justify-center text-primary mb-2"><FaFileAlt size={28} /></div>
        <h3 className="text-lg font-black text-slate-800 dark:text-white">Consulta tu estado de cuenta</h3>
        <p className="text-slate-400 text-sm mt-1">Ingresa tu código de cliente</p>
      </div>
      <div className="flex gap-2 mb-2">
        <input type="text" placeholder="Ej: PC-001" value={codigo}
          onChange={e => { setCodigo(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && buscar()}
          className="flex-1 min-w-0 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors uppercase" />
        <button onClick={buscar} className="bg-primary hover:bg-primaryHover text-white font-bold px-4 md:px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap">
          Consultar
        </button>
      </div>
      <p className="text-xs text-slate-300 text-center mb-3">Ingresa el código que recibiste al pre-reservar</p>
      {error && <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 text-center mb-3">Código no encontrado.</div>}
      {resultado && (
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl gap-2">
            <div className="min-w-0">
              <p className="font-black text-slate-800 dark:text-white truncate">{resultado.nombre}</p>
              <p className="text-xs text-slate-400">Lote {resultado.lote} · Bermejo</p>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${completado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {completado ? "✅ Listo" : "⏳ En curso"}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Progreso</span><span className="font-bold">{pct}%</span></div>
          <div className="w-full bg-gray-100 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
            <div className="h-3 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: completado ? "linear-gradient(90deg,#2ecc71,#27ae60)" : "linear-gradient(90deg,#f5a623,#e67e22)" }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Pagadas", val: resultado.pagadas,                          color: "text-green-600",              bg: "bg-green-50 dark:bg-green-900/30"  },
              { label: "Restan",  val: resultado.totalCuotas - resultado.pagadas,  color: "text-orange-500",             bg: "bg-orange-50 dark:bg-orange-900/30"},
              { label: "Total",   val: resultado.totalCuotas,                      color: "text-slate-700 dark:text-slate-200", bg: "bg-slate-50 dark:bg-slate-700" },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} rounded-xl py-3 text-center`}>
                <p className={`text-xl font-black ${c.color}`}>{c.val}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-center mt-4">
        <Link to="/mi-cuenta" className="text-sm text-primary hover:underline font-semibold">Ver historial completo →</Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="dark:bg-slate-900">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-screen lg:h-screen lg:min-h-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-emerald-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />

        <div className="relative z-10 flex w-full min-h-screen lg:h-screen lg:min-h-0">
          <div className="hidden lg:block w-36 xl:w-44 flex-shrink-0 overflow-hidden">
            <ColumnaCarrusel direction="up" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center text-white px-5 md:px-8 pt-20 pb-10">

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3 drop-shadow-lg">
              TU LOTE EN<br />
              <span className="text-yellow-300">PLAYA CAÑAVERAL</span><br />
              TE ESPERA
            </h1>

            <div className="w-full max-w-xl mb-3 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 flex-shrink-0">
              <img src="/fotos/Area_Verde5.jpeg" alt="Playa Cañaveral"
                className="w-full h-32 sm:h-36 md:h-40 object-cover" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-3">
              <span className="text-yellow-300 font-black text-xl md:text-2xl">Desde $1/día</span>
              <span className="text-white/40">·</span>
              <span className="text-white/75 text-sm">250 m² · Bermejo, Tarija</span>
              <span className="text-white/40">·</span>
              <span className="text-white/75 text-xs font-semibold bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                ¿Sigues pagando alquiler?
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-5 w-full max-w-xs sm:max-w-none">
              <Link to="/lotes?vista=grilla"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-black px-7 py-2.5 rounded-full shadow-xl transition-all hover:scale-105 text-sm text-center flex items-center justify-center gap-2">
                Ver Lotes Disponibles <FaArrowRight size={11} />
              </Link>
              <a href="#promo"
                className="bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white font-semibold px-7 py-2.5 rounded-full transition-colors text-sm text-center">
                Ver la Promoción
              </a>
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-8 w-full max-w-sm md:max-w-2xl lg:max-w-none">
              <Stat valor="65"     label="Lotes"     sublabel="Bermejo"      />
              <Stat valor="250"    suffix=" m²" label="Por lote" sublabel="Garantizados" />
              <Stat valor="9"      label="Manzanas"  sublabel="Bermejo"      />
              <Stat valor="$1/día" label="Desde"     sublabel="Sin excusas" amarillo />
            </div>
          </div>

          <div className="hidden lg:block w-36 xl:w-44 flex-shrink-0 overflow-hidden">
            <ColumnaCarrusel direction="down" />
          </div>
        </div>
      </section>

      {/* ══ STRIP CONFIANZA ═══════════════════════════════════ */}
      <div className="bg-slate-800 dark:bg-black text-white py-4 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4 md:gap-8">
          {[
            { icon: <FaMapMarkerAlt size={12} />, texto: "BERMEJO, TARIJA, BOLIVIA"       },
            { icon: <FaCheckCircle size={12} />,  texto: "PROYECTO LEGALMENTE REGISTRADO"  },
            { icon: <FaDollarSign size={12} />,   texto: "DESDE $1 POR DÍA"               },
            { icon: <MdPool size={14} />,          texto: "MEMBRESÍA PARQUE ACUÁTICO"      },
          ].map(({ icon, texto }) => (
            <div key={texto} className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400">{icon}</span>
              <span className="text-xs font-medium tracking-wide">{texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PROMOCIÓN LLAMATIVA ═══════════════════════════════ */}
      <section id="promo" className="py-16 md:py-20 px-4 md:px-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* ── COLUMNA IZQUIERDA: texto ── */}
            <FadeIn>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/25 border border-white/40 rounded-full px-4 py-1.5 text-xs font-black text-white uppercase tracking-widest mb-5">
                  <FaStar size={10} /> Oferta limitada
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow">
                  ¿SIGUES<br />PAGANDO<br /><span className="text-green-900">ALQUILER?</span>
                </h2>
                <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
                  Por menos de lo que pagas de arriendo, <strong>tienes tu propio lote</strong> de 250 m² en Bermejo con <strong>Parque Acuático incluido.</strong>
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  {[
                    "Sin cuota inicial obligatoria",
                    "Membresía vitalicia para 5 personas",
                    "Documentación legal en regla",
                    "Luz y agua en cada lote",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-black">✓</span>
                      </div>
                      <p className="text-white font-semibold text-sm md:text-base">{f}</p>
                    </div>
                  ))}
                </div>
                <Link to="/lotes?vista=grilla"
                  className="inline-flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white font-black px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105 text-sm md:text-base">
                  QUIERO MI LOTE AHORA <FaArrowRight size={12} />
                </Link>
              </div>
            </FadeIn>

            {/* ── COLUMNA DERECHA: card con imágenes eslogan ── */}
            <FadeIn delay={150}>
              <div className="bg-white rounded-3xl border-4 border-green-900 shadow-2xl overflow-hidden">
                {/* Imágenes eslogan tipo collage */}
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative h-44 overflow-hidden">
                    <img src="/fotos/Piscina.png" alt="Parque Acuático" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                    <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-black uppercase tracking-wide px-2">PARQUE ACUÁTICO</p>
                  </div>
                  <div className="relative h-44 overflow-hidden">
                    <img src="/fotos/Area_Verde5.jpeg" alt="Área verde" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                    <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-black uppercase tracking-wide px-2">ÁREAS VERDES</p>
                  </div>
                  <div className="relative h-36 overflow-hidden">
                    <img src="/fotos/Canchas.png" alt="Canchas" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent" />
                    <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-black uppercase tracking-wide px-2">CANCHAS DEPORTIVAS</p>
                  </div>
                  <div className="relative h-36 overflow-hidden">
                    <img src="/fotos/SalonEven.png" alt="Salón eventos" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent" />
                    <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-black uppercase tracking-wide px-2">SALÓN DE EVENTOS</p>
                  </div>
                </div>
                {/* Precio destacado */}
                <div className="p-5 text-center bg-white">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">TU LOTE DESDE</p>
                  <p className="text-7xl font-black text-green-600 leading-none">$1</p>
                  <p className="text-2xl font-black text-slate-800 mb-3">por día</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-green-50 rounded-xl p-2 text-center">
                      <p className="text-green-700 font-black text-sm">250 m²</p>
                      <p className="text-slate-400 text-xs">por lote</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-2 text-center">
                      <p className="text-orange-600 font-black text-sm">$12,500</p>
                      <p className="text-slate-400 text-xs">precio total</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2 text-center">
                      <p className="text-blue-600 font-black text-sm">36 meses</p>
                      <p className="text-slate-400 text-xs">financiamiento</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-yellow-600">+ MEMBRESÍA PARQUE ACUÁTICO GRATIS</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ MEMBRESÍA PARQUE ACUÁTICO ════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-xs text-white font-bold tracking-widest uppercase mb-4">
              <MdPool size={14} /> Beneficio exclusivo incluido
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
              PARQUE ACUÁTICO BERMEJO
            </h2>
            <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto mb-6">
              Al comprar tu lote recibes <strong className="text-yellow-300">membresía vitalicia para 5 personas</strong> — sin cuota mensual adicional.
            </p>
          </FadeIn>

          {/* ── IMAGEN con texto superpuesto ── */}
          <FadeIn delay={100}>
            <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl border border-white/25 max-w-3xl mx-auto">
              <img src="/fotos/MembresiaRed.png" alt="Parque Acuático Bermejo"
                className="w-full h-120 md:h-160 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-center px-4">
                <div className="flex justify-center gap-3 text-white/80 mb-2">
                  <FaInfinity size={20} /><FaUsers size={20} />
                </div>
                <p className="text-3xl md:text-4xl font-black text-yellow-300 mb-1">MEMBRESÍA DE POR VIDA</p>
                <p className="text-white text-sm md:text-base">5 personas · Sin cuota mensual · A 15 min de Bermejo</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={150} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/lotes?vista=grilla"
              className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-black px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105 text-sm text-center">
              Reservar lote + membresía →
            </Link>
            <Link to="/membresia"
              className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-sm flex items-center justify-center gap-2">
              <MdPool size={16} /> Ver planes de membresía
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ══ AMENIDADES CON IMAGEN ════════════════════════════ */}
      <section id="proyecto" className="py-16 md:py-24 px-4 md:px-10 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-3">Lo que incluye</p>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white mb-3">
              TODO LO QUE NECESITAS PARA VIVIR BIEN
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
              Un condominio completo en <strong>Bermejo, Tarija</strong> — diseñado para tu familia.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {AMENIDADES.map((a, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-600 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <img src={a.img} alt={a.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <span className={`absolute top-3 left-3 text-xs font-black px-3 py-1 rounded-full shadow-md ${a.badgeColor}`}>
                      {a.badge}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-black text-slate-800 dark:text-white text-base mb-2">{a.titulo}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-1">{a.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINANCIAMIENTO ═══════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-white dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-10">
            <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-3">Financiamiento</p>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white mb-3">
              SIN EXCUSAS — DESDE $1 POR DÍA
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
              Tener tu propio lote en <strong>Bermejo</strong> no debe ser un lujo reservado para pocos.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
            {[
              { icon: <FaDollarSign size={28} />, titulo: "DESDE $1 POR DÍA",        desc: "El plan más accesible del mercado. Paga cómodamente desde el primer día sin grandes desembolsos.", highlight: true,  counter: null },
              { icon: <FaRuler size={26} />,       titulo: "250 m² REGISTRADOS",      desc: "Cada lote tiene 250 m² con escritura pública a tu nombre. Propiedad real, documentada y protegida por ley.",         highlight: false, counter: "250" },
              { icon: <FaFileAlt size={24} />,     titulo: "DOCUMENTACIÓN EN REGLA",  desc: "Planos aprobados, registro legal completo y proceso transparente. Tu inversión está 100% respaldada.",           highlight: false, counter: null },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className={`rounded-2xl p-6 md:p-8 h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]
                  ${item.highlight
                    ? "bg-primary border-primary shadow-xl shadow-green-200 dark:shadow-green-900"
                    : "bg-slate-50 dark:bg-slate-700 border-black dark:border-slate-500 hover:shadow-xl hover:border-primary"}`}>
                  <div className={`mb-4 ${item.highlight ? "text-white" : "text-primary"}`}>
                    {item.highlight ? (
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-black text-white leading-none">$1</span>
                        <span className="text-white/80 text-sm mb-1 font-semibold">/día</span>
                      </div>
                    ) : item.counter ? (
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-black text-primary leading-none">{item.counter}</span>
                        <span className="text-primary/80 text-sm mb-1 font-semibold">m²</span>
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center">
                        {item.icon}
                      </div>
                    )}
                  </div>
                  <h3 className={`font-black text-lg md:text-xl mb-3 ${item.highlight ? "text-white" : "text-slate-800 dark:text-white"}`}>{item.titulo}</h3>
                  <p className={`text-sm leading-relaxed ${item.highlight ? "text-white/85" : "text-slate-400 dark:text-slate-300"}`}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center">
            <div className="bg-slate-50 dark:bg-slate-700 border-2 border-black dark:border-slate-500 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-slate-800 dark:text-white font-black text-xl mb-1">¿LISTO PARA EMPEZAR?</p>
                <p className="text-slate-400 text-sm">Un asesor te explica todos los planes de pago disponibles.</p>
              </div>
              <a href={`https://wa.me/59171295179?text=${encodeURIComponent("Hola, me interesa información sobre los planes de financiamiento de Playa Cañaveral.")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black px-8 py-3.5 rounded-full text-sm transition-colors">
                <FaWhatsapp size={16} /> Consultar por WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ UBICACIÓN ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-white dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-8">
            <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-3">Ubicación</p>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white mb-3">ESTAMOS EN BERMEJO, TARIJA</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 rounded-full px-5 py-2 text-sm font-semibold">
                <FaMapMarkerAlt size={12} /> Bermejo, Tarija, Bolivia
              </div>
            </div>
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-black dark:border-slate-600">
              <img src="/fotos/fondo.png" alt="Plano Playa Cañaveral"
                className="w-full object-cover max-h-[280px] md:max-h-[520px]" />
            </div>
            <div className="text-center mt-8">
              <Link to="/lotes?vista=grilla" className="bg-primary hover:bg-primaryHover text-white font-bold px-8 md:px-10 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 inline-block text-sm md:text-base">
                Ver Lotes Disponibles en Bermejo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-gradient-to-br from-green-800 to-emerald-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <FadeIn>
            <div className="flex justify-center text-emerald-300 mb-3"><FaShieldAlt size={20} /></div>
            <p className="text-emerald-300 text-xs font-semibold tracking-widest uppercase mb-3">Bermejo, Tarija · Oferta limitada</p>
            <h2 className="text-2xl md:text-4xl font-black mb-3">¿SIGUES ESPERANDO EL MOMENTO IDEAL?</h2>
            <p className="text-white/80 text-sm md:text-base mb-2 max-w-md mx-auto">
              El momento ideal <strong className="text-yellow-300">es ahora.</strong> 65 lotes, precios accesibles y membresía incluida.
            </p>
            <p className="text-yellow-300 font-black text-xl md:text-2xl mb-8">DESDE SOLO $1 POR DÍA — TU PATRIMONIO EMPIEZA HOY</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/lotes?vista=grilla" className="bg-white text-green-800 font-black px-8 md:px-10 py-4 rounded-full shadow-xl hover:bg-emerald-50 transition-all hover:scale-105 text-sm md:text-base text-center flex items-center justify-center gap-2">
                Ver Lotes en Bermejo <FaArrowRight size={12} />
              </Link>
              <Link to="/contacto" className="bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors text-sm md:text-base text-center">
                Hablar con un asesor
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
