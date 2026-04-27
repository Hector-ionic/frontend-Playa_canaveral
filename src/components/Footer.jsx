import { Link } from "react-router-dom";

const WA_URL = "https://wa.me/59171295179?text=Hola,%20me%20interesa%20información%20sobre%20Playa%20Cañaveral.";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 dark:bg-black text-white pt-12 pb-6 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Col 1 */}
          <div>
            <img src="/fotos/logo.png" alt="Playa Cañaveral" className="h-20 w-auto object-contain mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed">
              Condominio residencial en <strong className="text-white">Bermejo, Tarija, Bolivia</strong>.
              Lotes de 250 m² con servicios completos y áreas de recreación.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
              <span>📍</span><span>Bermejo, Tarija, Bolivia</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-5">Navegación</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Inicio",       to: "/"          },
                { label: "Lotes",        to: "/lotes"     },
                { label: "Membresía",    to: "/membresia" },
                { label: "Mi Cuenta",    to: "/mi-cuenta" },
                { label: "Contacto",     to: "/contacto"  },
                { label: "Pre-Reservar", to: "/lotes", highlight: true },
              ].map(({ label, to, highlight }) => (
                <Link key={label} to={to}
                  className={`text-sm transition-colors ${highlight ? "text-primary font-bold" : "text-slate-400 hover:text-white"}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-5">Contacto</p>
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>📍</span><span>Bermejo, Tarija, Bolivia</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>📞</span><span>+591 71295179</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>📧</span><span>parqueacuaticobermejo@gmail.com</span>
              </div>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.724.885.916-3.619-.235-.372A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.423-4.394 9.818-9.818 9.818z"/>
              </svg>
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-700 pt-6 text-center">
          <p className="text-slate-500 text-xs">
            © {year} Condominio Playa Cañaveral · Bermejo, Tarija, Bolivia · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
