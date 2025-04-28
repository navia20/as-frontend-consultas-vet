export const LOGIN_MUTATION = `
  mutation loginCliente($email: String!, $password: String!) {
    loginCliente(input: {
      email: $email,
      password: $password
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
