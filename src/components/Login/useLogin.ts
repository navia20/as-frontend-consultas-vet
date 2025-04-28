import { useState } from "react";
import { client } from "../../graphqlClient";
import { LOGIN_MUTATION } from "./Login.mutations";

interface LoginVariables {
  email: string;
  password: string;
}

interface LoginResponse {
  loginCliente: {
    access_token: string;
    expires_in: number;
    cliente: {
      id: string;
      nombre: string;
    };
  };
}

export function useLoginCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loginCliente = async (variables: LoginVariables) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await client.request<LoginResponse>(
        LOGIN_MUTATION,
        variables
      );
      setSuccess("Login exitoso");
      return response.loginCliente;
    } catch (err: any) {
      setError("Error al iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginCliente, loading, error, success };
}
