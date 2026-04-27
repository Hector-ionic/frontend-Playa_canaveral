import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaWhatsapp } from "react-icons/fa";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LAT = -22.715216;
const LNG = -64.302737;

const WA_URL = "https://wa.me/59171295179?text=Hola,%20me%20interesa%20información%20sobre%20los%20lotes%20de%20Playa%20Cañaveral%20en%20Bermejo,%20Tarija.";

const INFO = [
  { icon: <FaMapMarkerAlt className="text-primary" size={18} />, titulo: "Ubicación", valor: "Bermejo, Tarija, Bolivia" },
  { icon: <FaPhone className="text-primary" size={16} />,        titulo: "Teléfono",  valor: "+591 71295179"            },
  { icon: <FaEnvelope className="text-primary" size={16} />,     titulo: "Correo",    valor: "parqueacuaticobermejo@gmail.com" },
  { icon: <FaClock className="text-primary" size={16} />,        titulo: "Atención",  valor: "Lunes a Sábado · 8:00 AM – 6:00 PM" },
];

export default function Contacto() {
  const [form, setForm]       = useState({ name: "", phone: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const [error, setError]     = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.email || !form.mensaje) {
      setError(true);
      return;
    }
    setError(false);
    setEnviado(true);
  };

  const handleReset = () => {
    setForm({ name: "", phone: "", email: "", mensaje: "" });
    setEnviado(false);
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* ── ENCABEZADO ── */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-2">Contacto</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-1">¿LISTO PARA INVERTIR?</h1>
          <p className="text-slate-400 dark:text-slate-300 text-sm">
            Condominio Playa Cañaveral · <strong className="text-slate-600 dark:text-slate-200">Bermejo, Tarija, Bolivia</strong> · Un asesor te contactará en menos de 24 horas.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="lg:col-span-1 flex flex-col gap-4">

            {INFO.map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-black dark:border-slate-600 p-5 shadow-sm flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">{item.titulo}</p>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.valor}</p>
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3.5 rounded-2xl text-sm text-center transition-colors shadow-sm flex items-center justify-center gap-2">
              <FaWhatsapp size={18} />
              Escribir por WhatsApp
            </a>

            {/* Mapa */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm" style={{ height: 220 }}>
              <MapContainer center={[LAT, LNG]} zoom={16} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                <Marker position={[LAT, LNG]}>
                  <Popup>
                    <strong>Playa Cañaveral Condominio</strong><br />
                    Bermejo, Tarija, Bolivia
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <a href={`https://www.google.com/maps?q=${LAT},${LNG}`} target="_blank" rel="noopener noreferrer"
              className="text-center text-xs text-slate-400 hover:text-green-500 transition-colors">
              📍 Abrir en Google Maps · Bermejo, Tarija
            </a>
          </div>

          {/* ── FORMULARIO ── */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-black dark:border-slate-600 p-8 shadow-sm">
              {!enviado ? (
                <>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1">ENVÍANOS UN MENSAJE</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-300 mb-6">Lotes en Bermejo, Tarija · Respondemos en menos de 24 horas</p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-4">
                      Por favor completa todos los campos antes de enviar.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">Nombre</label>
                      <input type="text" placeholder="Nombre completo" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">Teléfono</label>
                      <input type="text" placeholder="WhatsApp / Teléfono" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">Correo electrónico</label>
                      <input type="email" placeholder="tucorreo@email.com" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">Mensaje</label>
                      <textarea placeholder="¿Tienes alguna pregunta sobre los lotes en Bermejo, Tarija?" rows={4}
                        value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })}
                        className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary transition-colors resize-none" />
                    </div>
                  </div>

                  <button onClick={handleSubmit}
                    className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md">
                    Enviar Mensaje
                  </button>
                </>
              ) : (
                <div className="text-center py-10">
                  <span className="text-6xl">✅</span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-5 mb-3">¡MENSAJE ENVIADO!</h3>
                  <p className="text-slate-400 text-sm mb-2">
                    Gracias por contactarnos.
                  </p>
                  <p className="text-slate-400 text-sm mb-8">
                    Un asesor de <strong>Playa Cañaveral · Bermejo, Tarija</strong> se comunicará contigo en menos de 24 horas.
                  </p>
                  <button onClick={handleReset}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-primaryHover transition-colors">
                    Enviar otro mensaje
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
