import React from 'react';
import './ClientDashboard.css'; // Archivo CSS para estilos específicos

const ClientDashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenido, [Nombre del Cliente]</h1>
        <button className="logout-button">Cerrar Sesión</button>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2>Perfil</h2>
          <p>Consulta y edita la información de tu perfil.</p>
          <button className="dashboard-button">Editar Perfil</button>
        </div>
        <div className="dashboard-card">
          <h2>Agendar Cita</h2>
          <p>Programa una nueva cita con el veterinario.</p>
          <button className="dashboard-button">Agendar</button>
        </div>
        <div className="dashboard-card">
          <h2>Historial de Citas</h2>
          <p>Revisa el historial de tus citas anteriores.</p>
          <button className="dashboard-button">Ver Historial</button>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;