import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCrearAppointment } from "./useCrearAppointment";

const appointmentSchema = z.object({
  fecha_hora: z.string().min(1, "La fecha y hora son obligatorias"),
  mascota_nombre: z.string().min(1, "El nombre de la mascota es obligatorio"),
  observaciones: z.string().optional(),
});

type AppointmentFormInputs = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSuccess,
  onError,
  onClose,
}) => {
  const { crearAppointment, loading, error, success } = useCrearAppointment();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormInputs>({
    resolver: zodResolver(appointmentSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: AppointmentFormInputs) => {
    try {
      await crearAppointment(data);
      onSuccess("¡Cita agendada con éxito!");
      reset();
      onClose();
    } catch (e) {
      onError("Error al agendar la cita. Inténtalo más tarde.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Fecha y Hora:
        <input
          type="datetime-local"
          {...register("fecha_hora")}
          disabled={loading}
        />
        {errors.fecha_hora && (
          <span className="error">{errors.fecha_hora.message}</span>
        )}
      </label>
      <label>
        Nombre de la Mascota:
        <input
          type="text"
          {...register("mascota_nombre")}
          placeholder="Nombre de la mascota"
          disabled={loading}
        />
        {errors.mascota_nombre && (
          <span className="error">{errors.mascota_nombre.message}</span>
        )}
      </label>
      <label>
        Observaciones:
        <textarea
          {...register("observaciones")}
          placeholder="Escribe alguna observación (opcional)"
          disabled={loading}
        />
        {errors.observaciones && (
          <span className="error">{errors.observaciones.message}</span>
        )}
      </label>
      <button type="submit" className="dashboard-button" disabled={loading}>
        {loading ? "Agendando..." : "Confirmar"}
      </button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default AppointmentForm;
