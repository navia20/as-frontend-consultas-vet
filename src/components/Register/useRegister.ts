import { useState } from "react";
import { client } from "../../graphqlClient";
import { REGISTER_MUTATION } from "./Register.mutations";

interface RegisterVariables {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
}

interface RegisterResponse {
  registerCliente: {
    access_token: string;
    expires_in: number;
    cliente: {
      id: string;
      nombre: string;
    };
  };
}

export function useRegisterCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const registerCliente = async (variables: RegisterVariables) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await client.request<RegisterResponse>(
        REGISTER_MUTATION,
        variables
      );
      setSuccess("Cliente registrado correctamente");
      return response.registerCliente;
    } catch (err: any) {
      setError("Error al registrar cliente");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerCliente, loading, error, success };
}
