import React, { useState } from "react";

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
  const [appointmentData, setAppointmentData] = useState({
    fecha: "",
    hora: "",
    mascota_nombre: "",
    observaciones: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !appointmentData.fecha ||
      !appointmentData.hora ||
      !appointmentData.mascota_nombre
    ) {
      onError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    setSubmitting(true);
    try {
      // Aquí iría la llamada real a la API
      // await api.agendarCita(appointmentData);
      setTimeout(() => {
        setSubmitting(false);
        onSuccess("¡Cita agendada con éxito!");
        onClose();
      }, 800);
    } catch (error) {
      setSubmitting(false);
      onError("Error al agendar la cita. Inténtalo más tarde.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Fecha:
        <input
          type="date"
          name="fecha"
          value={appointmentData.fecha}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Hora:
        <input
          type="time"
          name="hora"
          value={appointmentData.hora}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Nombre de la Mascota:
        <input
          type="text"
          name="mascota_nombre"
          value={appointmentData.mascota_nombre}
          onChange={handleInputChange}
          placeholder="Nombre de la mascota"
          required
        />
      </label>
      <label>
        Observaciones:
        <textarea
          name="observaciones"
          value={appointmentData.observaciones}
          onChange={handleInputChange}
          placeholder="Escribe alguna observación (opcional)"
        />
      </label>
      <button type="submit" className="dashboard-button" disabled={submitting}>
        {submitting ? "Agendando..." : "Confirmar"}
      </button>
    </form>
  );
};

export default AppointmentForm;
