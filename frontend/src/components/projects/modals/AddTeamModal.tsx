import React, { useState, useContext, useEffect } from 'react';
import SuccessAlert from '../../shared/alerts/SuccessAlert';
import ErrorAlert from '../../shared/alerts/ErrorAlert';
import InfoAlert from '../../shared/alerts/InfoAlert';
import { fetchUserIdByUsername } from '../../../hooks/fetchUserIdByUsername';
import { AuthContext } from '../../../context/AuthContext';
import {
  deleteProjectRoleById,
  addTeamMember,
  updateTeamMemberRole,
  getProjectRoles, // Servicio para cargar roles del equipo
} from '../../../services/projectService'; // Importamos los servicios

interface TeamMember {
  project_role_id: number;
  user_id: number;
  username: string;
  role: string;
}

interface AddTeamModalProps {
  projectId: number;
  closeModal: () => void;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({ projectId, closeModal }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [memberToUpdate, setMemberToUpdate] = useState<TeamMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  // Cargar los miembros del equipo cuando se abre el modal
  useEffect(() => {
    const loadTeamMembers = async () => {
      setLoading(true);
      try {
        if (!token) throw new Error('Token no disponible.');

        // Usamos el servicio para obtener los roles del equipo
        const data = await getProjectRoles(projectId, token);
        if (data.length === 0) {
          InfoAlert({ message: 'El proyecto no tiene un equipo establecido.' });
        }
        setTeam(data);
      } catch (error) {
        ErrorAlert({ message: error instanceof Error ? error.message : 'Error inesperado al cargar los miembros.' });
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, [projectId, token]);

  // Manejar la adición de un miembro al equipo
  const handleAddTeamMember = async () => {
    if (!username || !role) {
      ErrorAlert({ message: 'Por favor, ingrese un nombre de usuario y un rol.' });
      return;
    }

    setLoading(true);
    try {
      const userId = await fetchUserIdByUsername(username);
      if (!userId) throw new Error('Usuario no encontrado.');

      if (team.some((member) => member.user_id === userId)) {
        ErrorAlert({ message: 'El usuario ya está asignado al equipo.' });
        setLoading(false);
        return;
      }

      if (!token) throw new Error('Token no disponible.');

      // Llamar al servicio para agregar el miembro
      await addTeamMember(projectId, userId, role, token);

      setTeam([...team, { user_id: userId, username, role, project_role_id: Date.now() }]);
      setUsername('');
      setRole('');
      SuccessAlert({ message: `Usuario ${username} agregado exitosamente.` });
    } catch (error) {
      ErrorAlert({ message: error instanceof Error ? error.message : 'Error inesperado al agregar el miembro.' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar la actualización de rol
  const handleUpdateRole = (member: TeamMember) => {
    setMemberToUpdate(member);
  };

  const confirmUpdateRole = async () => {
    if (!memberToUpdate) return;

    try {
      if (!token) throw new Error('Token no disponible.');

      // Llamar al servicio para actualizar el rol
      await updateTeamMemberRole(memberToUpdate.project_role_id, memberToUpdate.role, token);

      SuccessAlert({ message: `Rol actualizado exitosamente para ${memberToUpdate.username}.` });
      setMemberToUpdate(null);
    } catch (error) {
      ErrorAlert({ message: error instanceof Error ? error.message : 'Error inesperado al actualizar el rol.' });
    }
  };

  // Manejar la eliminación de un miembro del equipo
  const handleRemoveMember = (member: TeamMember) => {
    setMemberToRemove(member);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      if (!token) throw new Error('Token no disponible.');

      // Llamar al servicio para eliminar el rol del proyecto
      await deleteProjectRoleById(memberToRemove.project_role_id, token);

      setTeam(team.filter((member) => member.project_role_id !== memberToRemove.project_role_id));
      SuccessAlert({ message: 'Miembro eliminado exitosamente.' });
      setMemberToRemove(null);
    } catch (error) {
      ErrorAlert({ message: error instanceof Error ? error.message : 'Error inesperado al eliminar el miembro.' });
      setMemberToRemove(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        {/* Botón de cierre en la esquina superior derecha */}
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Agregar Miembro al Equipo</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Nombre de usuario:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Rol:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Seleccionar rol</option>
            <option value="QA">QA</option>
            <option value="Tester">Tester</option>
            <option value="Developer">Desarrollador</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={handleAddTeamMember} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? 'Agregando...' : 'Agregar'}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Miembros del equipo:</h3>
          {team.length === 0 ? (
            <p>No hay miembros agregados aún.</p>
          ) : (
            team.map((member) => (
              <div key={member.project_role_id} className="flex justify-between items-center mb-2">
                <span>
                  {member.username} ({member.role})
                </span>
                <div className="flex space-x-2">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      setTeam(
                        team.map((m) => (m.project_role_id === member.project_role_id ? { ...m, role: e.target.value } : m))
                      )
                    }
                    className="border border-gray-300 rounded px-2"
                  >
                    <option value="QA">QA</option>
                    <option value="Tester">Tester</option>
                    <option value="Developer">Desarrollador</option>
                  </select>
                  <button onClick={() => handleUpdateRole(member)} className="bg-green-500 text-white rounded-full p-2">
                    ✔
                  </button>
                  <button onClick={() => handleRemoveMember(member)} className="bg-red-500 text-white rounded-full p-2">
                    ✖
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de confirmación para actualizar rol */}
        {memberToUpdate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>
                ¿Estás seguro de que deseas cambiar el rol de {memberToUpdate.username} a {memberToUpdate.role}?
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <button onClick={confirmUpdateRole} className="bg-green-500 text-white px-4 py-2 rounded">
                  Confirmar
                </button>
                <button onClick={() => setMemberToUpdate(null)} className="bg-gray-300 px-4 py-2 rounded">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar miembro */}
        {memberToRemove && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>¿Estás seguro de que deseas eliminar a {memberToRemove.username} del equipo?</p>
              <div className="flex justify-end space-x-4 mt-4">
                <button onClick={confirmRemoveMember} className="bg-red-500 text-white px-4 py-2 rounded">
                  Confirmar
                </button>
                <button onClick={() => setMemberToRemove(null)} className="bg-gray-300 px-4 py-2 rounded">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTeamModal;
