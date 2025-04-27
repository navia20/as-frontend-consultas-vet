import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './ClientDashboard.css'; // Archivo CSS para estilos específicos

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const [clientData, setClientData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '123-456-7890',
    address: 'Calle Falsa 123, Ciudad, País',
  });
  const [tempClientData, setTempClientData] = useState(clientData); // Estado temporal para edición
  const [isEditing, setIsEditing] = useState(false); // Estado para alternar entre vista y edición
  const [appointmentData, setAppointmentData] = useState({
    fecha_hora: '',
    mascota_nombre: '',
    observaciones: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  interface Cita {
    fecha_hora: string;
    mascota_nombre: string;
    estado: string;
    observaciones: string;
  }

  const [historial, setHistorial] = useState<Cita[]>([]); // Estado para almacenar el historial
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla si el modal está visible
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false); // Modal para agendar cita

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    navigate('/'); // Redirige al usuario a la página de inicio de sesión
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setTempClientData(clientData); // Sincroniza los datos actuales con el estado temporal
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempClientData({ ...tempClientData, [name]: value }); // Actualiza los datos temporales
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleSave = () => {
    setClientData(tempClientData); // Guarda los datos editados
    setIsEditing(false); // Salir del modo de edición
    console.log('Datos guardados:', tempClientData);
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointmentData.fecha_hora || !appointmentData.mascota_nombre) {
      setErrorMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    console.log('Agendando cita con los datos:', appointmentData);

    // Simulación de éxito
    setSuccessMessage('¡Cita agendada con éxito!');
    setErrorMessage('');
    setAppointmentData({ fecha_hora: '', mascota_nombre: '', observaciones: '' });
    setIsAppointmentModalVisible(false); // Cierra el modal después de agendar
  };

  // Función para obtener el historial desde el backend
  const fetchHistorial = async () => {
    try {
      const response = await fetch('/api/historial'); // Cambia la URL según tu backend
      const data = await response.json();
      setHistorial(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      setErrorMessage('No se pudo cargar el historial. Inténtalo más tarde.');
    }
  };

  // Maneja la apertura del modal
  const openModal = () => {
    setErrorMessage(''); // Limpia el mensaje de error
    setSuccessMessage(''); // Limpia el mensaje de éxito
    setIsModalVisible(true); // Abre el modal
  };

  // Maneja el cierre del modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openHistorialModal = async () => {
    try {
      setErrorMessage(''); // Limpia mensajes previos
      setSuccessMessage(''); // Limpia mensajes previos

      // Obtiene el historial desde el backend
      const response = await fetch('/api/historial');
      const data = await response.json();

      setHistorial(data); // Almacena el historial en el estado
      setIsModalVisible(true); // Abre el modal
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      setErrorMessage('No se pudo cargar el historial. Inténtalo más tarde.');
      setIsModalVisible(true); // Abre el modal para mostrar el error
    }
  };

  // Maneja la apertura del modal de agendar cita
  const openAppointmentModal = () => {
    setErrorMessage(''); // Limpia el mensaje de error
    setSuccessMessage(''); // Limpia el mensaje de éxito
    setIsAppointmentModalVisible(true); // Abre el modal
  };

  // Maneja el cierre del modal de agendar cita
  const closeAppointmentModal = () => {
    setIsAppointmentModalVisible(false);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-logo-title">
          <img src="/assets/Logo.png" alt="Logo" className="logo" />
          <h1>Clinica Capa 8</h1>
        </div>
        <button className="logout-button" onClick={() => navigate('/')}>
          Cerrar Sesión
        </button>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2>Perfil del Cliente</h2>
          {isEditing ? (
            <div>
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={tempClientData.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Correo:
                <input
                  type="email"
                  name="email"
                  value={tempClientData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Teléfono:
                <input
                  type="text"
                  name="phone"
                  value={tempClientData.phone}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Dirección:
                <input
                  type="text"
                  name="address"
                  value={tempClientData.address}
                  onChange={handleInputChange}
                />
              </label>
              <button className="dashboard-button" onClick={handleSave}>
                Guardar
              </button>
              <button className="dashboard-button" onClick={handleEditToggle}>
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <p><strong>Nombre:</strong> {clientData.name}</p>
              <p><strong>Correo:</strong> {clientData.email}</p>
              <p><strong>Teléfono:</strong> {clientData.phone}</p>
              <p><strong>Dirección:</strong> {clientData.address}</p>
              <button className="dashboard-button" onClick={handleEditToggle}>
                Editar
              </button>
            </div>
          )}
        </div>
        <div className="dashboard-card">
          <h2>Agendar Cita</h2>
          <button className="dashboard-button" onClick={openAppointmentModal}>
            Agendar
          </button>
        </div>
        <div className="dashboard-card">
          <h2>Historial de Citas</h2>
          <button className="dashboard-button" onClick={openHistorialModal}>
            Ver Historial
          </button>
        </div>
      </main>

      {/* Modal para agendar cita */}
      {isAppointmentModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeAppointmentModal}>
              &times;
            </button>
            <h2>Agendar Cita</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleScheduleAppointment}>
              <label>
                Fecha y Hora:
                <input
                  type="datetime-local"
                  name="fecha_hora"
                  value={appointmentData.fecha_hora}
                  onChange={(e) =>
                    setAppointmentData({ ...appointmentData, fecha_hora: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Nombre de la Mascota:
                <input
                  type="text"
                  name="mascota_nombre"
                  value={appointmentData.mascota_nombre}
                  onChange={(e) =>
                    setAppointmentData({ ...appointmentData, mascota_nombre: e.target.value })
                  }
                  placeholder="Nombre de la mascota"
                  required
                />
              </label>
              <label>
                Observaciones:
                <textarea
                  name="observaciones"
                  value={appointmentData.observaciones}
                  onChange={(e) =>
                    setAppointmentData({ ...appointmentData, observaciones: e.target.value })
                  }
                  placeholder="Escribe alguna observación (opcional)"
                />
              </label>
              <button type="submit" className="dashboard-button">
                Confirmar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para el historial */}
      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>Historial de Citas</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {historial.length > 0 ? (
              <table className="historial-table">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Mascota</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((cita, index) => (
                    <tr key={index}>
                      <td>{cita.fecha_hora}</td>
                      <td>{cita.mascota_nombre}</td>
                      <td>{cita.estado}</td>
                      <td>{cita.observaciones}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay citas registradas.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;



