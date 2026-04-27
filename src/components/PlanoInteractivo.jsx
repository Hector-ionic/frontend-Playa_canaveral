import { useState, useRef, useCallback } from "react";

const VW = 1400;
const VH = 990;

export default function PlanoInteractivo({ onReservar }) {
  const containerRef = useRef(null);

  const [zoom, setZoom]           = useState(1);
  const [pan, setPan]             = useState({ x: 0, y: 0 });
  const [dragging, setDragging]   = useState(false);
  const [dragStart, setDragStart] = useState(null);

  // Zoom con rueda del mouse
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom(z => Math.min(Math.max(z * factor, 1), 6));
  }, []);

  // Paneo con arrastre
  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging && dragStart) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [dragging, dragStart]);

  const handleMouseUp = () => setDragging(false);

  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">

      {/* Botones zoom */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1">
        <button
          onClick={() => setZoom(z => Math.min(z * 1.3, 6))}
          className="bg-white border border-gray-200 rounded-lg w-9 h-9 text-xl font-black text-slate-600 hover:bg-gray-50 shadow flex items-center justify-center"
        >+</button>
        <button
          onClick={() => setZoom(z => Math.max(z * 0.77, 1))}
          className="bg-white border border-gray-200 rounded-lg w-9 h-9 text-xl font-black text-slate-600 hover:bg-gray-50 shadow flex items-center justify-center"
        >−</button>
        <button
          onClick={resetZoom}
          title="Restablecer vista"
          className="bg-white border border-gray-200 rounded-lg w-9 h-9 text-base text-slate-400 hover:bg-gray-50 shadow flex items-center justify-center"
        >⊙</button>
      </div>

      {/* Indicador de zoom */}
      <div className="absolute top-3 left-3 z-30 bg-white/90 border border-gray-100 rounded-lg px-2 py-1 text-xs text-slate-400 shadow select-none">
        {Math.round(zoom * 100)}%{zoom > 1 ? " · Arrastra para mover" : " · Scroll para zoom"}
      </div>

      {/* Contenedor del plano */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{ cursor: dragging ? "grabbing" : zoom > 1 ? "grab" : "default" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full h-auto select-none"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 0.1s ease",
            display: "block",
          }}
        >
          <image
            href="/fotos/Mapeo1.png"
            x="0" y="0"
            width={VW}
            height={VH}
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
    </div>
  );
}