export const LOGIN_MUTATION = `
mutation {
  loginCliente(input: {
    email: "gabriel.zuleta@alumnos.ucn.cl",
    password: "secret123",
  }) {
    access_token
    expires_in
    cliente {
      id
      nombre
    }
  }
}
    `;