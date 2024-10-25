import React, { useState, useEffect, useContext } from 'react';
import SuccessAlert from '../../shared/alerts/SuccessAlert';
import ErrorAlert from '../../shared/alerts/ErrorAlert';
import ConfirmDialog from '../../auth/ConfirmDialog';
import { AuthContext } from '../../../context/AuthContext';
import { SERVIDOR } from '../../../services/Servidor';

interface ProjectData {
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface PartialProjectData {
  p_project_name?: string;
  p_description?: string;
  p_start_date?: string;
  p_end_date?: string;
  p_status?: string;
}

interface EditProjectModalProps {
  projectId: number;
  closeModal: () => void;
  updateProject: (updatedProject: ProjectData) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ projectId, closeModal, updateProject }) => {
  const [projectData, setProjectData] = useState<ProjectData>({
    project_name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const authContext = useContext(AuthContext);
  const { token } = authContext || {};

  const statusMap: Record<string, string> = {
    'Pendiente': 'Pending',
    'En progreso': 'In Progress',
    'Completado': 'Completed',
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!token) {
        ErrorAlert({ message: 'Token no disponible. No se pueden cargar los datos.' });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${SERVIDOR}/api/project/${projectId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los detalles del proyecto');
        }

        const data = await response.json();
        setProjectData({
          project_name: data.project_name,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
        });
      } catch (error) {
        console.error('Error al cargar los detalles del proyecto:', error);
        ErrorAlert({ message: 'Error al cargar los detalles del proyecto' });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    // Se crea un tipo más flexible para permitir campos opcionales
    const updatedProject: PartialProjectData = {
      ...(projectData.project_name && { p_project_name: projectData.project_name }),
      ...(projectData.description && { p_description: projectData.description }),
      ...(projectData.start_date && { p_start_date: projectData.start_date }),
      ...(projectData.end_date && { p_end_date: projectData.end_date }),
      ...(statusMap[projectData.status] && { p_status: statusMap[projectData.status] }),
    };

    try {
      const response = await fetch(`${SERVIDOR}/api/project/update/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el proyecto');
      }

      SuccessAlert({ message: 'Proyecto actualizado exitosamente' });
      updateProject(projectData); // Aquí actualizamos el proyecto con todos los datos originales
      closeModal();
    } catch {
      ErrorAlert({ message: 'Error al actualizar el proyecto' });
      closeModal();
    }

    setShowConfirmDialog(false);
  };

  const handleCancelUpdate = () => {
    setShowConfirmDialog(false);
  };

  if (loading) {
    return <div>Cargando datos del proyecto...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Editar Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del Proyecto:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={projectData.project_name}
              onChange={(e) => setProjectData({ ...projectData, project_name: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Descripción:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="flex justify-between gap-4">
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700">Fecha de Inicio:</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={projectData.start_date}
                onChange={(e) => setProjectData({ ...projectData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700">Fecha de Finalización:</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={projectData.end_date}
                onChange={(e) => setProjectData({ ...projectData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Estado:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={projectData.status}
              onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button type="submit" className="bg-[#042354] hover:bg-[#28559c] text-white px-4 py-2 rounded">
              Guardar Cambios
            </button>
            <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </form>

        {showConfirmDialog && (
          <ConfirmDialog
            message="¿Estás seguro de que deseas guardar los cambios en este proyecto?"
            onConfirm={handleConfirmUpdate}
            onCancel={handleCancelUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default EditProjectModal;
