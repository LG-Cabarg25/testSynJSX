import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import SuccessAlert from '../../shared/alerts/SuccessAlert';
import ErrorAlert from '../../shared/alerts/ErrorAlert';
import TaskAssignmentCreate from '../../../hooks/TaskAssignmentCreate';
import { SERVIDOR } from '../../../services/Servidor';

interface User {
  user_id: number;
  project_role_id: number;
  username: string;
  role: string;
}

interface Task {
  task_id: number;
  taskDescription: string;
  status: string;
  assignedAt: string;
  assignedToUserName: string;
}

interface NewTaskModalProps {
  projectId: number;
  projectName: string;
  closeModal: () => void;
  addTask: (newTask: Task) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ projectId, projectName, closeModal, addTask }) => {
  const { token, user } = useContext(AuthContext) || {};
  const { createTaskAssignment } = TaskAssignmentCreate();
  const [nameTask, setNameTask] = useState('');
  const [description, setDescription] = useState('');  // Campo de descripción
  const [status, setStatus] = useState('To do');
  const [loading, setLoading] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await fetch(`${SERVIDOR}/api/project/${projectId}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los usuarios asignados.');
        }

        const data = await response.json();
        setAssignedUsers(data);
      } catch (error) {
        ErrorAlert({ message: 'Error al obtener los usuarios asignados.' });
      }
    };

    fetchAssignedUsers();
  }, [projectId, token]);

  const handleCreateTask = async () => {
    const userSelected = assignedUsers.find(u => u.project_role_id === parseInt(selectedUserId));
  

  
    if (!nameTask || !description || !status || !userSelected) {
      ErrorAlert({ message: 'Todos los campos son obligatorios.' });
      return;
    }
  
    setLoading(true);
  
    try {
      const newTask = {
        p_user_id: user.user_id,
        p_project_id: projectId,
        p_project_role_id: userSelected.project_role_id,
        p_name_task: nameTask,  // Cambia a p_name_task para coincidir con el backend
        p_description: description,  // Deja esto igual ya que coincide
        p_status: status,  // Deja esto igual ya que coincide
      };

  
      const result = await createTaskAssignment(newTask);
  
      if (result.success) {
        SuccessAlert({ message: 'Tarea creada exitosamente.' });
  
        // Agregar la nueva tarea al estado
        addTask({
          task_id: result.assignmentId,
          taskDescription: nameTask,
          status,
          assignedAt: new Date().toISOString(),
          assignedToUserName: userSelected.username,
        });
  
        closeModal();
      } else {
        throw new Error(result.message || 'Error en la creación de la tarea');
      }
    } catch (error) {
      ErrorAlert({ message: `Error al crear la tarea: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
        <h2 className="text-2xl font-bold mb-4">Asignar tarea a {projectName}</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Asignar a usuario</label>
          <select
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un usuario</option>
            {assignedUsers.map(user => (
              <option key={`${user.user_id}-${user.project_role_id}`} value={String(user.project_role_id)}>
                {user.username} - {user.role}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Nombre Tarea</label>
          <input
            type="text"
            value={nameTask}
            onChange={e => setNameTask(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escriba el nombre de la tarea"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describa la tarea"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Estado</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="In review">In review</option>
            <option value="In testing">In testing</option>
            <option value="Approved">Approved</option>
            <option value="Returned">Returned</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateTask}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Creando...' : 'Crear Tarea'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
