import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; // Archivo CSS para estilos específicos

const AdminDashboard: React.FC = () => {
  const [reservas, setReservas] = useState<any[]>([]); // Estado para las reservas
  const [medicos, setMedicos] = useState<{ id: string; nombre: string; disponibilidad: string; email: string; telefono: string }[]>([]); // Estado para los médicos
  const [newMedico, setNewMedico] = useState({
    nombre: '',
    disponibilidad: 'Disponible', // Valor predeterminado
    email: '',
    telefono: '',
  }); // Estado para el nuevo veterinario
  const [selectedReserva, setSelectedReserva] = useState<any>(null); // Reserva seleccionada para asignar médico
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false); // Modal para asignar médico
  const [selectedMedico, setSelectedMedico] = useState(''); // Médico seleccionado
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Función para obtener las reservas desde el backend
  const fetchReservas = async () => {
    try {
      const response = await fetch('/api/reservas'); // Cambia la URL según tu backend
      const data = await response.json();
      setReservas(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
      setErrorMessage('No se pudo cargar las reservas. Inténtalo más tarde.');
    }
  };

  // Función para obtener los médicos
  const fetchMedicos = async () => {
    try {
      const response = await fetch('/api/medicos');
      const data = await response.json();
      setMedicos(data);
    } catch (error) {
      console.error('Error al obtener los médicos:', error);
    }
  };

  // Función para registrar un nuevo veterinario
  const handleRegisterMedico = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/medicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedico),
      });
      if (response.ok) {
        const medico = await response.json();
        setMedicos([...medicos, medico]); // Agregar el nuevo médico a la lista
        setSuccessMessage('Veterinario registrado con éxito.');
        setNewMedico({ nombre: '', disponibilidad: '', email: '', telefono: '' }); // Limpiar el formulario
      } else {
        setErrorMessage('No se pudo registrar el veterinario.');
      }
    } catch (error) {
      console.error('Error al registrar el veterinario:', error);
      setErrorMessage('No se pudo registrar el veterinario.');
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchReservas();
    fetchMedicos();
  }, []);

  // Función para abrir el modal de asignación
  const openAssignModal = (reserva: any) => {
    setSelectedReserva(reserva);
    setIsAssignModalVisible(true);
  };

  // Función para cerrar el modal de asignación
  const closeAssignModal = () => {
    setSelectedReserva(null);
    setSelectedMedico('');
    setIsAssignModalVisible(false);
  };

  // Función para asignar un médico a una reserva
  const assignMedico = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reservas/${selectedReserva.id}/asignar-medico`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medico_id: selectedMedico }),
      });
      if (response.ok) {
        const updatedReserva = await response.json();
        setReservas(
          reservas.map((reserva: any) =>
            reserva.id === updatedReserva.id ? updatedReserva : reserva
          )
        );
        closeAssignModal();
      } else {
        console.error('Error al asignar el médico.');
      }
    } catch (error) {
      console.error('Error al asignar el médico:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>Panel de Administración</h1>
      </header>
      <main className="admin-dashboard-main">
        <h2>Registrar Veterinario</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <form onSubmit={handleRegisterMedico} className="register-form">
          <label>
            Nombre:
            <input
              type="text"
              value={newMedico.nombre}
              onChange={(e) => setNewMedico({ ...newMedico, nombre: e.target.value })}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={newMedico.email}
              onChange={(e) => setNewMedico({ ...newMedico, email: e.target.value })}
              required
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              value={newMedico.telefono}
              onChange={(e) => setNewMedico({ ...newMedico, telefono: e.target.value })}
              required
            />
          </label>
          <button type="submit" className="save-button">
            Registrar
          </button>
        </form>

        <h2>Reservas</h2>
        {reservas.length > 0 ? (    
          <table className="reservas-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Cliente</th>
                <th>Mascota</th>
                <th>Estado</th>
                <th>Observaciones</th>
                <th>Médico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva: any, index: number) => (
                <tr key={index}>
                  <td>{reserva.fecha_hora}</td>
                  <td>{reserva.cliente_nombre}</td>
                  <td>{reserva.mascota_nombre}</td>
                  <td>{reserva.estado}</td>
                  <td>{reserva.observaciones}</td>
                  <td>{reserva.medico_nombre || 'No asignado'}</td>
                  <td>
                    <button
                      className="assign-button"
                      onClick={() => openAssignModal(reserva)}
                    >
                      Asignar Médico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay reservas registradas.</p>
        )}
      </main>

      {/* Modal para asignar médico */}
      {isAssignModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeAssignModal}>
              &times;
            </button>
            <h2>Asignar Médico</h2>
            <form onSubmit={assignMedico}>
              <label>
                Seleccionar Médico:
                <select
                  value={selectedMedico}
                  onChange={(e) => setSelectedMedico(e.target.value)}
                  required
                >
                  <option value="">Seleccione un médico</option>
                  {medicos.map((medico: any) => (
                    <option key={medico.id} value={medico.id}>
                      {medico.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="save-button">
                Asignar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;