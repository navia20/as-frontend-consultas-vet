export const CREAR_RESERVA_MUTATION = `
  mutation CrearReserva($cliente_id: Int!, $veterinario_id: Int!, $horario: String!) {
    crearReserva(cliente_id: $cliente_id, veterinario_id: $veterinario_id, horario: $horario) {
      id
      horario
      cliente { id nombre }
      veterinario { id nombre }
    }
  }
`;
