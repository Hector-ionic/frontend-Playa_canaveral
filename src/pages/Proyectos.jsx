import { useState } from "react";
import { FaSearchPlus, FaTimes } from "react-icons/fa";

const PROYECTOS = [
  { src: "/fotos/Area_Verde5.jpeg",        titulo: "VISTA GENERAL",        desc: "Área central del condominio"    },
  { src: "/fotos/Area_Verde4.jpeg",        titulo: "ÁREAS VERDES",         desc: "Espacios naturales"             },
  { src: "/fotos/Ingreso_Condominio.png",  titulo: "ACCESO PRINCIPAL",     desc: "Ingreso controlado"             },
  { src: "/fotos/Area_Verde3.jpeg",        titulo: "NATURALEZA",           desc: "Entorno natural"                },
  { src: "/fotos/Area_Verde2.jpeg",        titulo: "ESPACIOS ABIERTOS",    desc: "Zonas de recreación"            },
  { src: "/fotos/Area_Verde1.jpeg",        titulo: "VISTA AÉREA",          desc: "Perspectiva del proyecto"       },
  { src: "/fotos/Area_Verde.jpeg",         titulo: "VISTA PANORÁMICA",     desc: "Condominio completo"            },
  { src: "/fotos/fondo.png",               titulo: "PLANO DEL CONDOMINIO", desc: "Distribución de manzanas"       },
  { src: "/fotos/ParqueInf.png",           titulo: "PARQUES INFANTILES",   desc: "Espacios diseñados para niños"  },
  { src: "/fotos/Seg.png",                 titulo: "SEGURIDAD 24/7",       desc: "Vigilancia permanente"          },
  { src: "/fotos/AreaPav.png",             titulo: "VÍAS PAVIMENTADAS",    desc: "Calles internas asfaltadas"     },
  { src: "/fotos/img10.jpeg",              titulo: "SALÓN DE EVENTOS",     desc: "Espacios para celebraciones"    },
  { src: "/fotos/img8.jpeg",               titulo: "PATIO DE COMIDAS",     desc: "Opciones gastronómicas"         },
];

export default function Proyectos() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Encabezado */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-2">Condominio Playa Cañaveral</p>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white mb-1">NUESTROS PROYECTOS</h1>
          <p className="text-slate-400 text-sm">Imágenes reales del proyecto · <strong className="text-slate-600 dark:text-slate-300">Bermejo, Tarija, Bolivia</strong></p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {PROYECTOS.map((item, i) => (
            <div key={i}
              className="group bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-600 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              onClick={() => setSelected(item)}>
              <div className="relative aspect-video overflow-hidden">
                <img src={item.src} alt={item.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <FaSearchPlus className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={28} />
                </div>
              </div>
              <div className="p-4">
                <p className="font-black text-slate-800 dark:text-white text-sm mb-0.5">{item.titulo}</p>
                <p className="text-xs text-slate-400">{item.desc} · Bermejo, Tarija</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors">
              <FaTimes size={24} />
            </button>
            <img src={selected.src} alt={selected.titulo}
              className="w-full rounded-2xl shadow-2xl" />
            <div className="mt-3 text-center">
              <p className="text-white font-black text-lg">{selected.titulo}</p>
              <p className="text-white/60 text-sm">{selected.desc} · Bermejo, Tarija</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
