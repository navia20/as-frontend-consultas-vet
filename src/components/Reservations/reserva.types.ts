export interface Cliente {
  id: number;
  nombre: string;
}

export interface Veterinario {
  id: number;
  nombre: string;
}

export interface Reserva {
  id: number;
  horario: string;
  cliente: Cliente;
  veterinario: Veterinario;
}

export interface CrearReservaResponse {
  crearReserva: Reserva;
}

export interface CrearReservaVariables {
  cliente_id: number;
  veterinario_id: number;
  horario: string;
}
