export function saveClienteToLocalStorage(
  cliente: { id: string; nombre: string; email?: string },
  access_token?: string
) {
  localStorage.setItem("cliente_id", cliente.id);
  localStorage.setItem("cliente_nombre", cliente.nombre);
  if (cliente.email) localStorage.setItem("cliente_email", cliente.email);
  if (access_token) localStorage.setItem("access_token", access_token);
}
