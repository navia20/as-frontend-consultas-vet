export const CREAR_APPOINTMENT_MUTATION = `
  mutation CrearReserva($fecha_hora: String!, $mascota_nombre: String!, $observaciones: String) {
    crearReserva(
      fecha_hora: $fecha_hora,
      mascota_nombre: $mascota_nombre,
      observaciones: $observaciones
    ) {
      id
      fecha_hora
      mascota_nombre
      observaciones
    }
  }
`;
