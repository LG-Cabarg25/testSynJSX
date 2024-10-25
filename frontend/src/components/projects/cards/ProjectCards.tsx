import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import EditProjectModal from '../modals/EditProjectModal';
import ConfirmDeleteModal from '../../shared/ConfirmDeleteModal';
import AddTeamModal from '../modals/AddTeamModal';
import OptionsOfPM from '../../optionsRoles/OptionsOfPM';
import OptionsOfQA from '../../optionsRoles/OptionsOfQA';
import OptionsOfDev from '../../optionsRoles/OptionsOfDev';
import OptionsOfTester from '../../optionsRoles/OptionsOfTester';
import SuccessAlert from '../../shared/alerts/SuccessAlert';
import ErrorAlert from '../../shared/alerts/ErrorAlert';
import NewTaskModal from '../modals/NewTaskModal'; 
import { deleteProjectById } from '../../../services/projectService';

interface ProjectCardProps {
  p_title: string;
  p_description: string;
  p_pm_id?: string;
  p_status: string;
  p_end_date: string;
  projectId: number;
  userRoleInProject?: string; 
  onProjectDeleted: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  p_title,
  p_pm_id,
  p_description,
  p_status,
  p_end_date,
  projectId,
  userRoleInProject,
  onProjectDeleted,
}) => {
  const authContext = React.useContext(AuthContext);
  const { user, token } = authContext || {}; 
  const userId = user?.user_id || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | undefined>(userRoleInProject);

  const translatedStatus = {
    Pending: 'Pendiente',
    'In Progress': 'En progreso',
    Completed: 'Completado',
  }[p_status] || p_status;

  const statusColor = {
    Pendiente: 'bg-red-500 text-white',
    'En progreso': 'bg-yellow-500 text-white',
    Completado: 'bg-green-500 text-white',
  }[translatedStatus];

  useEffect(() => {
    if (userId === p_pm_id) {
      setCurrentRole('PM');
    }
  }, [userId, p_pm_id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenTeamModal = () => setIsTeamModalOpen(true);
  const handleCloseTeamModal = () => setIsTeamModalOpen(false);
  const handleOpenTaskModal = () => setIsTaskModalOpen(true);
  const handleCloseTaskModal = () => setIsTaskModalOpen(false);
  const openConfirmDeleteModal = () => setIsConfirmDeleteOpen(true);
  const closeConfirmDeleteModal = () => setIsConfirmDeleteOpen(false);

  const handleDeleteProject = async () => {
    if (!token) {
      ErrorAlert({ message: 'No se encontró el token de autenticación.' });
      return;
    }

    try {
      await deleteProjectById(projectId, token);
      onProjectDeleted(projectId);
      SuccessAlert({ message: 'Proyecto eliminado exitosamente.' });
    } catch {
      ErrorAlert({ message: 'Error al eliminar el proyecto.' });
    }
  };

  return (
    <div className="relative bg-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow min-h-[300px] max-h-[400px] w-full mx-auto">
      <h3 className="text-xl font-bold mb-2">{p_title}</h3>

      <p className="text-gray-600 mb-6 overflow-hidden text-ellipsis">Descripción: {p_description}</p>

      <p className={`text-sm font-bold py-1 px-3 rounded-full w-auto inline-block ${statusColor}`}>
        {translatedStatus}
      </p>

      <p className="absolute bottom-4 left-4 text-sm text-gray-600">Límite: {p_end_date}</p>

      {currentRole && (
        <p className="absolute top-4 right-4 text-sm text-blue-500 font-semibold">
          Rol: {currentRole}
        </p>
      )}

      <div className="absolute bottom-4 right-4 flex space-x-3">
        {currentRole === 'PM' && (
          <OptionsOfPM
            userRole={currentRole}
            projectId={projectId}
            p_pm_id={p_pm_id!.toString()}
            userId={userId.toString()}
            onOpenModal={handleOpenModal}
            onOpenTeamModal={handleOpenTeamModal}
            onOpenConfirmDelete={openConfirmDeleteModal}
            onOpenTaskModal={handleOpenTaskModal} 
          />
        )}

        {currentRole === 'QA' && (
          <OptionsOfQA userRole={currentRole} onClickCreateTestPlan={() => {}} />
        )}

        {currentRole === 'Developer' && <OptionsOfDev userRole={currentRole} />}
        {currentRole === 'Tester' && <OptionsOfTester userRole={currentRole} />}
      </div>

      {isModalOpen && (
        <EditProjectModal projectId={projectId} closeModal={handleCloseModal} updateProject={handleCloseModal} />
      )}

      {isTeamModalOpen && <AddTeamModal projectId={projectId} closeModal={handleCloseTeamModal} />}
      {isTaskModalOpen && (
        <NewTaskModal
          projectId={projectId}
          projectName={p_title}  
          pmId={p_pm_id}         
          pmName={user?.username} 
          closeModal={handleCloseTaskModal}
          addTask={() => {}}
        />
      )}

      {isConfirmDeleteOpen && (
        <ConfirmDeleteModal
          projectName={p_title}
          onConfirm={handleDeleteProject}
          onCancel={closeConfirmDeleteModal}
        />
      )}
    </div>
  );
};

export default ProjectCard;
