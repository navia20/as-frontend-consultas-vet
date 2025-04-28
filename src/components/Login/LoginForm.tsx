import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginCliente } from "./useLogin";
import { saveClienteToLocalStorage } from "../../utils/localStorageCliente";
import "./LoginForm.css";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginCliente, loading, error, success } = useLoginCliente();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  // Modal y recuperación de contraseña (sin cambios)
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] =
    React.useState(false);
  const [step, setStep] = React.useState(1);
  const [recoveryEmail, setRecoveryEmail] = React.useState("");
  const [recoveryCode, setRecoveryCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [modalError, setModalError] = React.useState("");

  const onSubmit = async (data: LoginFormInputs) => {
    console.log("[Login] Datos enviados desde el formulario:", data);
    try {
      const response = await loginCliente({
        email: data.email,
        password: data.password,
      });
      console.log("[Login] Respuesta exitosa:", response);
      saveClienteToLocalStorage(
        {
          id: response.cliente.id,
          nombre: response.cliente.nombre,
          email: data.email,
        },
        response.access_token
      );
      navigate("/client");
    } catch (e) {
      console.log("[Login] Error al iniciar sesión:", e);
    }
  };

  // Funciones de recuperación de contraseña (sin cambios, solo usan modalError)
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleForgotPassword = () => {
    setIsForgotPasswordVisible(true);
    setStep(1);
    setModalError("");
  };
  const handleSendRecoveryEmail = () => {
    if (!recoveryEmail) {
      setModalError("Por favor, ingresa tu correo.");
      return;
    }
    if (!isValidEmail(recoveryEmail)) {
      setModalError("Por favor, ingresa un correo válido.");
      return;
    }
    console.log("Enviando código de recuperación a:", recoveryEmail);
    setModalError("");
    setStep(2);
  };
  const handleValidateCode = () => {
    if (!recoveryCode) {
      setModalError("Por favor, ingresa el código de recuperación.");
      return;
    }
    console.log("Validando código:", recoveryCode);
    setModalError("");
    setStep(3);
  };
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setModalError("Por favor, completa todos los campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalError("Las contraseñas no coinciden.");
      return;
    }
    console.log("Restableciendo contraseña a:", newPassword);
    setModalError("");
    setIsForgotPasswordVisible(false);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="../assets/Felino-jugando.jpg"
          alt="Felino jugando"
          className="login-image"
        />
      </div>
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="Ingresa tu correo"
              disabled={loading}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" /> Recuérdame
            </label>
            <a href="#" onClick={handleForgotPassword}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
        <p className="register-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
      {/* Modal para recuperación de contraseña */}
      {isForgotPasswordVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-button"
              onClick={() => setIsForgotPasswordVisible(false)}
            >
              &times;
            </button>
            {step === 1 && (
              <div>
                <h2>Recuperar Contraseña</h2>
                <p>Ingresa tu correo para enviar un código de recuperación.</p>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                />
                {modalError && <p className="error">{modalError}</p>}
                <button onClick={handleSendRecoveryEmail} className="btn-login">
                  Enviar Código
                </button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2>Validar Código</h2>
                <p>Ingresa el código que recibiste en tu correo.</p>
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="Ingresa el código"
                />
                {modalError && <p className="error">{modalError}</p>}
                <button onClick={handleValidateCode} className="btn-login">
                  Validar Código
                </button>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2>Restablecer Contraseña</h2>
                <p>Ingresa tu nueva contraseña.</p>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                />
                {modalError && <p className="error">{modalError}</p>}
                <button onClick={handleResetPassword} className="btn-login">
                  Restablecer Contraseña
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
