import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterCliente } from "./useRegister";
import "./RegisterForm.css";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    email: z.string().email("Correo inválido"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
    telefono: z.string().min(1, "El teléfono es obligatorio"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { registerCliente, loading, error, success } = useRegisterCliente();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    console.log("[Register] Datos enviados desde el formulario:", data);
    try {
      console.log("[Register] Llamando a registerCliente con:", {
        nombre: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        telefono: data.telefono,
        direccion: data.direccion,
      });
      const response = await registerCliente({
        nombre: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        telefono: data.telefono,
        direccion: data.direccion,
      });
      console.log("[Register] Respuesta exitosa:", response);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e) {
      console.log("[Register] Error al registrar:", e);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src="/assets/Felino-jugando.jpg"
          alt="Felino jugando"
          className="register-image"
        />
      </div>
      <div className="register-card">
        <h2>Crear Cuenta</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="firstName">Nombre</label>
            <input
              id="firstName"
              {...register("firstName")}
              placeholder="Ingresa tu nombre"
              disabled={loading}
            />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Apellido</label>
            <input
              id="lastName"
              {...register("lastName")}
              placeholder="Ingresa tu apellido"
              disabled={loading}
            />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Ingresa tu correo"
              disabled={loading}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              {...register("telefono")}
              placeholder="Ingresa tu teléfono"
              disabled={loading}
            />
            {errors.telefono && (
              <span className="error">{errors.telefono.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              {...register("direccion")}
              placeholder="Ingresa tu dirección"
              disabled={loading}
            />
            {errors.direccion && (
              <span className="error">{errors.direccion.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Crea una contraseña"
              disabled={loading}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirma tu contraseña"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword.message}</span>
            )}
          </div>
          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="/">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
