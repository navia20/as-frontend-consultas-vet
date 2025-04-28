import { useState } from "react";
import { client } from "../../graphqlClient";
import { CREAR_RESERVA_MUTATION } from "./reserva.mutations";
import { CrearReservaVariables, CrearReservaResponse } from "./reserva.types";

export function useCrearReserva() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const crearReserva = async (variables: CrearReservaVariables) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await client.request<CrearReservaResponse>(
        CREAR_RESERVA_MUTATION,
        variables
      );
      setSuccess("Reserva creada correctamente");
      return response.crearReserva;
    } catch (err: any) {
      setError("Error al crear reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearReserva, loading, error, success };
}
