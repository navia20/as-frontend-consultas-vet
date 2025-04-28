import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Archivo CSS para estilos específicos

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false); // Estado para mostrar el modal
  const [step, setStep] = useState(1); // Paso del flujo de recuperación
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Función para validar el formato del correo
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Completa todos los campos.');
      return;
    }

    console.log('Iniciando sesión con:', { email, password });
    setError('');
    navigate('/client'); // Redirige al dashboard
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordVisible(true);
    setStep(1); // Reinicia el flujo al primer paso
  };

  const handleSendRecoveryEmail = () => {
    if (!recoveryEmail) {
      setError('Por favor, ingresa tu correo.');
      return;
    }
    if (!isValidEmail(recoveryEmail)) {
      setError('Por favor, ingresa un correo válido.');
      return;
    }
    console.log('Enviando código de recuperación a:', recoveryEmail);
    setError('');
    setStep(2); // Avanza al siguiente paso
  };

  const handleValidateCode = () => {
    if (!recoveryCode) {
      setError('Por favor, ingresa el código de recuperación.');
      return;
    }
    console.log('Validando código:', recoveryCode);
    setError('');
    setStep(3); // Avanza al siguiente paso
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    console.log('Restableciendo contraseña a:', newPassword);
    setError('');
    setIsForgotPasswordVisible(false); // Cierra el modal
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="../assets/Felino-jugando.jpg" alt="Felino jugando" className="login-image" />
      </div>
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" /> Recuérdame
            </label>
            <a href="#" onClick={handleForgotPassword}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button type="submit" className="btn-login">Iniciar Sesión</button>
        </form>
        <p className="register-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>

      {/* Modal para recuperación de contraseña */}
      {isForgotPasswordVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setIsForgotPasswordVisible(false)}>
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