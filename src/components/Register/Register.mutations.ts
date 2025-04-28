export const REGISTER_MUTATION = `
  mutation RegisterCliente($nombre: String!, $email: String!, $password: String!, $telefono: String!) {
    registerCliente(input: {
      nombre: $nombre,
      email: $email,
      password: $password,
      telefono: $telefono
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