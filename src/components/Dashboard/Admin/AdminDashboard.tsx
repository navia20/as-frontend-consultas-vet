import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; // Archivo CSS para estilos específicos

const AdminDashboard: React.FC = () => {
  const [reservas, setReservas] = useState<any[]>([]); // Estado para las reservas
  const [usuarios, setUsuarios] = useState<any[]>([]); // Estado para los usuarios
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null); // Usuario seleccionado para editar
  const [isUserEditModalVisible, setIsUserEditModalVisible] = useState(false); // Modal para editar usuarios
  const [medicos, setMedicos] = useState([]); // Estado para los médicos
  const [selectedReserva, setSelectedReserva] = useState<any>(null); // Reserva seleccionada para asignar médico
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false); // Modal para asignar médico
  const [selectedMedico, setSelectedMedico] = useState(''); // Médico seleccionado

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

  // Función para obtener los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setErrorMessage('No se pudo cargar los usuarios. Inténtalo más tarde.');
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

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchReservas();
    fetchUsuarios();
    fetchMedicos();
  }, []);

  // Función para eliminar un usuario
  const deleteUsuario = async (id: number) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setUsuarios(usuarios.filter((usuario: any) => usuario.id !== id));
      } else {
        setErrorMessage('No se pudo eliminar el usuario.');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      setErrorMessage('No se pudo eliminar el usuario.');
    }
  };

  // Función para abrir el modal de edición de usuario
  const openUserEditModal = (usuario: any) => {
    setSelectedUsuario(usuario);
    setIsUserEditModalVisible(true);
  };

  // Función para cerrar el modal de edición de usuario
  const closeUserEditModal = () => {
    setSelectedUsuario(null);
    setIsUserEditModalVisible(false);
  };

  // Función para actualizar un usuario
  const updateUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/usuarios/${selectedUsuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUsuario),
      });
      if (response.ok) {
        const updatedUsuario = await response.json();
        setUsuarios(
          usuarios.map((usuario: any) =>
            usuario.id === updatedUsuario.id ? updatedUsuario : usuario
          )
        );
        closeUserEditModal();
      } else {
        setErrorMessage('No se pudo actualizar el usuario.');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setErrorMessage('No se pudo actualizar el usuario.');
    }
  };

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
        <h2>Reservas</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
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

        <h2>Usuarios Registrados</h2>
        {usuarios.length > 0 ? (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario: any, index: number) => (
                <tr key={index}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => openUserEditModal(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteUsuario(usuario.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay usuarios registrados.</p>
        )}
      </main>

      {/* Modal para editar usuario */}
      {isUserEditModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeUserEditModal}>
              &times;
            </button>
            <h2>Editar Usuario</h2>
            <form onSubmit={updateUsuario}>
              <label>
                Nombre:
                <input
                  type="text"
                  value={selectedUsuario.nombre}
                  onChange={(e) =>
                    setSelectedUsuario({
                      ...selectedUsuario,
                      nombre: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={selectedUsuario.email}
                  onChange={(e) =>
                    setSelectedUsuario({
                      ...selectedUsuario,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Rol:
                <select
                  value={selectedUsuario.rol}
                  onChange={(e) =>
                    setSelectedUsuario({
                      ...selectedUsuario,
                      rol: e.target.value,
                    })
                  }
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </label>
              <button type="submit" className="save-button">
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}

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