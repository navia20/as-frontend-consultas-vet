export const TODOS_VETERINARIOS_QUERY = `
  query TodosLosVeterinarios {
    veterinarios {
      id
      nombre
      email
      telefono
      disponibilidad
      reservas {
        id
        horario
      }
    }
  }
`;
