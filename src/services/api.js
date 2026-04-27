const BASE_URL = "http://localhost:4000/api";

const authH  = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("user_token")}` });
const adminH = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("admin_token")}` });

const req = (url, opts={}) => fetch(`${BASE_URL}${url}`, opts).then(r => r.json());

const post  = (url, body, h=authH)   => req(url, { method:"POST",   headers:h(), body:JSON.stringify(body) });
const get   = (url, h=authH)         => req(url, { headers:h() });
const put   = (url, body, h=authH)   => req(url, { method:"PUT",    headers:h(), body:JSON.stringify(body) });
const del   = (url, h=authH)         => req(url, { method:"DELETE", headers:h() });
const pub   = (url, body)            => req(url, { method:"POST",   headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });

// ── AUTH ──────────────────────────────────────────────────────
export const registrar        = (d) => pub("/auth/registro", d);
export const loginUsuario     = (d) => pub("/auth/login", d);
export const loginAdminApi    = (d) => pub("/auth/admin/login", d);
export const miPerfil         = ()  => get("/auth/perfil");
export const verificarSesion  = ()  => get("/auth/verificar");

// ── CUENTA ────────────────────────────────────────────────────
export const obtenerMiCuenta  = (cod) => fetch(`${BASE_URL}/compras/membresia/${cod}`).then(r=>r.json());
export const comprarMembresia = (d)   => post("/compras/membresia", d);
export const reservarLote     = (d)   => post("/compras/lote", d);

// ── SOLICITUDES ───────────────────────────────────────────────
export const solicitarCuotas  = (d)   => post("/solicitudes", d);
export const miSolicitud      = ()    => get("/solicitudes/mia");

// ── PAGOS ─────────────────────────────────────────────────────
export const subirComprobanteQR = (d) => post("/pagos/qr/subir", d);
export const iniciarPagoMP      = (d) => post("/pagos/mp/iniciar", d);

// ── ADMIN ─────────────────────────────────────────────────────
export const adminLogin             = (d)       => pub("/auth/admin/login", d);
export const adminDashboard         = ()        => get("/admin/dashboard", adminH);
export const adminPendientes        = ()        => get("/admin/pagos/pendientes", adminH);
export const adminTodosPagos        = ()        => get("/admin/pagos", adminH);
export const adminUsuarios          = ()        => get("/admin/usuarios", adminH);
export const adminConfirmar         = (id)      => post(`/admin/pagos/${id}/confirmar`, {}, adminH);
export const adminRechazar          = (id)      => post(`/admin/pagos/${id}/rechazar`,  {}, adminH);
export const adminEditarUsuario     = (id, d)   => put(`/admin/usuarios/${id}`, d, adminH);
export const adminEliminarUsuario   = (id)      => del(`/admin/usuarios/${id}`, adminH);
export const adminSolicitudes       = (e="pendiente") => get(`/solicitudes/admin?estado=${e}`, adminH);
export const adminAprobarSolicitud  = (id)      => post(`/solicitudes/admin/${id}/aprobar`,  {}, adminH);
export const adminRechazarSolicitud = (id, nota)=> post(`/solicitudes/admin/${id}/rechazar`, {nota}, adminH);
