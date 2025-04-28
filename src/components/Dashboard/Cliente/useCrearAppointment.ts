import { useState } from "react";
import { client } from "../../../graphqlClient";
import { CREAR_APPOINTMENT_MUTATION } from "./Appointment.mutations";

export interface CrearAppointmentInput {
  fecha_hora: string;
  mascota_nombre: string;
  observaciones?: string;
}

export interface Appointment {
  id: string;
  fecha_hora: string;
  mascota_nombre: string;
  observaciones?: string;
}

export interface CrearAppointmentResponse {
  crearReserva: Appointment;
}

export function useCrearAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const crearAppointment = async (input: {
    fecha_hora: string;
    mascota_nombre: string;
    observaciones?: string;
  }) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const variables = {
        fecha_hora: input.fecha_hora,
        mascota_nombre: input.mascota_nombre,
        observaciones: input.observaciones || null,
      };
      const response = await client.request<CrearAppointmentResponse>(
        CREAR_APPOINTMENT_MUTATION,
        variables
      );
      setSuccess("Cita agendada con éxito");
      return response.crearReserva;
    } catch (err: any) {
      setError("Error al agendar la cita");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearAppointment, loading, error, success };
}
