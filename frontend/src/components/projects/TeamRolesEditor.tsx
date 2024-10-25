import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context';
import { SERVIDOR } from '../../services/Servidor';

interface TeamRolesEditorProps {
  teamRoles: { user_id: number; role: string }[]; // Definición del tipo del arreglo de roles
  setTeamRoles: React.Dispatch<React.SetStateAction<{ user_id: number; role: string }[]>>; // Función para actualizar los roles
}

const TeamRolesEditor: React.FC<TeamRolesEditorProps> = ({ teamRoles, setTeamRoles }) => {
  const [newUserId, setNewUserId] = useState<number | null>(null);  // Estado para almacenar el ID del nuevo miembro
  const [newUserRole, setNewUserRole] = useState<string>('');       // Estado para almacenar el rol del nuevo miembro

  // Función para actualizar el rol de un miembro existente
  const handleRoleChange = (userId: number, newRole: string) => {
    const updatedRoles = teamRoles.map((role) =>
      role.user_id === userId ? { ...role, role: newRole } : role
    );
    setTeamRoles(updatedRoles);
  };

  const authContext = useContext(AuthContext);
  const {  token } = authContext || {};

  // Función para eliminar un miembro del equipo
  const handleRemoveMember = async (userId: number) => {
    try {
      const response = await fetch(`${SERVIDOR}/api/project/delete-project-roles/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el proyecto');
      }


    } catch (error) {
      console.log(error);
    }
  };

  // Función para agregar un nuevo miembro al equipo
  const handleAddMember = () => {
    if (newUserId && newUserRole) {
      const newMember = { user_id: newUserId, role: newUserRole };
      setTeamRoles([...teamRoles, newMember]);  // Agregar el nuevo miembro a la lista
      setNewUserId(null);  // Limpiar campos de entrada
      setNewUserRole('');
    } else {
      alert('Por favor ingresa un ID de usuario y un rol válido.');
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Roles del Equipo</h3>
      {teamRoles.length === 0 ? (
        <p>No hay miembros asignados en el equipo.</p>
      ) : (
        teamRoles.map((member) => (
          <div key={member.user_id} className="flex items-center justify-between mb-2">
            <span className="text-gray-700">ID: {member.user_id}</span>
            <input
              type="text"
              className="border p-2 rounded"
              value={member.role}
              onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
            />
            <button
              className="bg-red-500 text-white p-2 ml-4 rounded"
              onClick={() => handleRemoveMember(member.user_id)}
            >
              Eliminar
            </button>
          </div>
        ))
      )}

      {/* Formulario para agregar nuevos miembros */}
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Agregar nuevo miembro</h4>
        <input
          type="number"
          placeholder="ID del Usuario"
          className="border p-2 rounded mr-2"
          value={newUserId !== null ? newUserId : ''}  // Mostrar valor del ID del nuevo miembro
          onChange={(e) => setNewUserId(parseInt(e.target.value))}
        />
        <input
          type="text"
          placeholder="Rol del Usuario"
          className="border p-2 rounded mr-2"
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={handleAddMember}
        >
          Agregar Miembro
        </button>
      </div>
    </div>
  );
};

export default TeamRolesEditor;
