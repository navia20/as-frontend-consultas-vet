import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVeterinarios } from "./useVeterinarios";
import { useCrearReserva } from "./useCrearReserva";
import "./ReservationForm.css";

const schema = z.object({
  veterinario_id: z.number().min(1, "Veterinario requerido"),
  horario: z.string().min(1, "Horario requerido"),
});

type FormData = z.infer<typeof schema>;

const ReservationForm = () => {
  const { veterinarios, loading, error: fetchError } = useVeterinarios();
  const {
    crearReserva,
    loading: creating,
    error: createError,
    success,
  } = useCrearReserva();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const cliente_id = Number(localStorage.getItem("cliente_id"));
      await crearReserva({
        cliente_id,
        veterinario_id: Number(data.veterinario_id),
        horario: data.horario,
      });
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  return (
    <div className="reservation-container">
      <div className="reservation-card">
        <h2>Reservar Sesión</h2>
        {fetchError && <div className="reservation-error">{fetchError}</div>}
        {createError && <div className="reservation-error">{createError}</div>}
        {success && <div className="reservation-success">{success}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="reservation-form-group">
            <label>Veterinario</label>
            <select
              {...register("veterinario_id", { valueAsNumber: true })}
              disabled={loading || creating}
            >
              <option value="">Seleccione un veterinario</option>
              {veterinarios.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  {vet.nombre}
                </option>
              ))}
            </select>
            {errors.veterinario_id && (
              <span className="reservation-error">
                {errors.veterinario_id.message}
              </span>
            )}
          </div>
          <div className="reservation-form-group">
            <label>Horario</label>
            <input
              type="datetime-local"
              {...register("horario")}
              disabled={creating}
            />
            {errors.horario && (
              <span className="reservation-error">
                {errors.horario.message}
              </span>
            )}
          </div>
          <button
            className="reservation-btn"
            type="submit"
            disabled={isSubmitting || creating}
          >
            {creating ? "Reservando..." : "Reservar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
