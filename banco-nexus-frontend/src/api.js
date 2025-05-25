const API_BASE = "http://localhost:3000";

// Crear cliente
export async function crearCliente(data) {
  const res = await fetch(`${API_BASE}/cliente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Obtener cuenta

export const obtenerCuenta = async () => {
  const response = await fetch("http://localhost:3000/cuentas");
  if (!response.ok) throw new Error("Error al obtener las cuentas");
  return await response.json();
};

// Hacer transacción
export async function realizarTransaccion(data) {
  const res = await fetch(`${API_BASE}/transaccion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const obtenerTransacciones = async () => {
  const res = await fetch(`${API_BASE}/transacciones`);
  if (!res.ok) throw new Error("Error al obtener transacciones");
  return await res.json();
};
