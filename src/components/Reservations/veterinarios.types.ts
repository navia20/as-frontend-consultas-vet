export interface Reserva {
  id: number;
  horario: string;
}

export interface Veterinario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  disponibilidad: string;
  reservas: Reserva[];
}

export interface TodosLosVeterinariosResponse {
  veterinarios: Veterinario[];
}
