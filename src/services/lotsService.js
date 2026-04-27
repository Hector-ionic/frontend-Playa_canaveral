import lotesLocales from "../data/lotes.json";

const BASE_URL = "http://localhost:4000/api";

export const getLotes = async () => {
  try {
    const res = await fetch(`${BASE_URL}/lotes`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) return data;
    }
  } catch {
    // Si el backend no está disponible, usa JSON local
  }
  return lotesLocales;
};

export const getLoteById = (id) => {
  const lote = lotesLocales.find(l => l.id === id);
  return Promise.resolve(lote || null);
};

export const getLotesByZona = (zona) => {
  const filtrados = lotesLocales.filter(l => l.zona === zona);
  return Promise.resolve(filtrados);
};
