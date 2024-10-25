import React, { useState, useContext, useEffect } from 'react';
import NewTaskModal from '../../components/projects/modals/NewTaskModal';
import ViewTaskModal from '../../components/projects/modals/ViewTaskModal';
import ModalUpdateTask from '../../components/projects/modals/ModalUpdateTask';
import { AuthContext } from '../../context/AuthContext';
import OptionsOfPM from '../../components/optionsRoles/OptionsOfPM';
import OptionsOfQA from '../../components/optionsRoles/OptionsOfQA';
import OptionsOfDev from '../../components/optionsRoles/OptionsOfDev';
import OptionsOfTester from '../../components/optionsRoles/OptionsOfTester';
import AddTeamModal from '../../components/projects/modals/AddTeamModal';
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal';
import AssignmentCard from '../../components/projects/cards/AssigmentsCards';
import EditProjectModal from '../../components/projects/modals/EditProjectModal';
import { fetchTaskAssignments, updateTaskAssignment } from '../../services/assignmentsService';
import { registerProjectAssignmentComment } from '../../services/assignmentsCommentService';


interface Task {
  task_id: number;
  task_name: string;
  status: string;
  assignedAt: string;
  assignedToUserName: string;
}

interface Project {
  project_id: number;
  project_name: string;
  pm_id: number;
  role?: string;
}

const Board: React.FC = () => {
  const { user, token } = useContext(AuthContext);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un proyecto seleccionado en el localStorage
  useEffect(() => {
    const storedProject = localStorage.getItem('selectedProject');
    if (storedProject) {
      setSelectedProject(JSON.parse(storedProject));
    }
  }, []);

  // Función para cargar los proyectos donde el usuario esté asignado
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/project/user/${user?.user_id}/assigned`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los proyectos');
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        setProjects([]); // Manejo de errores
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchProjects();
    }
  }, [user, token]);

  // Función para cargar las tareas del proyecto seleccionado usando el servicio
  useEffect(() => {
    const fetchTasksForProject = async () => {
      try {
        if (selectedProject && token) {
          const tasksData = await fetchTaskAssignments(selectedProject.project_id, token);

          // Verificar si la respuesta no es un array y convertirla en un array
          const tasksArray = Array.isArray(tasksData) ? tasksData : [tasksData];

          const tasksWithMappedFields = tasksArray.map((task) => ({
            task_id: task.assignment_id,
            task_name: task.name_task || 'Sin nombre de tarea',
            status: task.status || 'Sin estado',
            assignedAt: task.assigned_at || 'Fecha no disponible',
            assignedToUserName: task.assigned_to_user || 'Usuario desconocido',
          }));

          setTasks(tasksWithMappedFields);
        }
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
        setTasks([]);
      }
    };

    fetchTasksForProject();
  }, [selectedProject, token]);

  // Función para agregar un comentario a una tarea
  const handleAddComment = async (taskId: number, newComment: { user: string; comment: string }) => {
    try {
      if (token) {
        // Llamada al servicio para registrar un nuevo comentario
        await registerProjectAssignmentComment({
          p_user_id: user?.user_id || 0,
          p_assignment_id: taskId,
          p_comments: newComment.comment,
        }, token);

        // Actualiza los comentarios localmente en el estado
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === taskId
              ? { ...task, comments: [...task.comments, newComment] }
              : task
          )
        );
      }
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      if (token) {
        const response = await updateTaskAssignment(taskId, newStatus, token);

        if (response && response.message === 'Tarea actualizada exitosamente') {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.task_id === taskId ? { ...task, status: newStatus } : task
            )
          );
          setShowUpdateTaskModal(false);
        } else {
          console.error('Error en la actualización:', response.message);
        }
      }
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMoveTask = (task: Task) => {
    if (!task.task_id || isNaN(task.task_id)) {
      console.error('El ID de la tarea no es válido al abrir el modal.');
      return;
    }
    setTaskToUpdate(task);
    setShowUpdateTaskModal(true);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = Number(e.target.value);
    const project = projects.find(p => p.project_id === selectedProjectId) || null;

    if (project) {
      const role = project.pm_id === user?.user_id ? 'PM' : project.role || 'guest';
      const projectData = {
        ...project,
        role,
      };
      setSelectedProject(projectData);
      localStorage.setItem('selectedProject', JSON.stringify(projectData));
    }
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  const groupedTasks = {
    'To do': tasks.filter(task => task.status === 'To do'),
    'In Progress': tasks.filter(task => task.status === 'In progress'),
    'In Review': tasks.filter(task => task.status === 'In review'),
    'In Testing': tasks.filter(task => task.status === 'In testing'),
    'Approved': tasks.filter(task => task.status === 'Approved'),
    'Returned': tasks.filter(task => task.status === 'Returned'),
    'Rejected': tasks.filter(task => task.status === 'Rejected'),
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (projects.length === 0) {
    return <div>No hay proyectos asignados.</div>;
  }

  return (
    <div className="p-8 bg-[#f4f6f9] min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl text-[#042354] font-bold mb-6">Tablero de tareas</h1>

        <div className="w-1/2">
          <select
            value={selectedProject?.project_id || ''}
            onChange={handleProjectChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="flex space-x-4">
            {selectedProject.role === 'PM' && (
              <OptionsOfPM
                userRole={selectedProject.role}
                projectId={selectedProject.project_id}
                p_pm_id={String(selectedProject.pm_id)}
                userId={String(user?.user_id)}
                onOpenModal={handleOpenModal}
                onOpenTeamModal={() => setShowTeamModal(true)}
                onOpenConfirmDelete={() => setShowDeleteConfirm(true)}
                onOpenTaskModal={() => setShowNewTaskModal(true)}
              />
            )}
            {selectedProject.role === 'QA' && <OptionsOfQA userRole={selectedProject.role} />}
            {selectedProject.role === 'Developer' && <OptionsOfDev userRole={selectedProject.role} />}
            {selectedProject.role === 'Tester' && <OptionsOfTester userRole={selectedProject.role} />}
          </div>
        )}
      </div>

      {isModalOpen && selectedProject && (
        <EditProjectModal
          projectId={selectedProject.project_id}
          closeModal={handleCloseModal}
          updateProject={handleCloseModal}
        />
      )}

      {showNewTaskModal && selectedProject && (
        <NewTaskModal
          projectId={selectedProject.project_id}
          projectName={selectedProject.project_name}
          closeModal={() => setShowNewTaskModal(false)}
          addTask={(newTask) => {
            setTasks((prevTasks) => [...prevTasks, newTask]);
          }}
        />
      )}

      {showTeamModal && selectedProject && (
        <AddTeamModal
          projectId={selectedProject.project_id}
          closeModal={() => setShowTeamModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          projectName={selectedProject?.project_name || ''}
          onConfirm={() => console.log('Proyecto eliminado')}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Object.keys(groupedTasks).map((status) => (
  <div key={status}>
    <h2 className="text-xl font-bold mb-4">{status}</h2>
    {groupedTasks[status].map((task, index) => (
  <AssignmentCard
  key={task.task_id}
  taskDescription={task.task_name}
  taskStatus={task.status}
  assignedAt={task.assignedAt}
  assignedToUserName={task.assignedToUserName}
  onMoveTask={() => handleMoveTask(task)}
  onViewTaskDetails={() => handleViewTaskDetails(task)}
  userRole={selectedProject?.role || 'guest'}
/>
))}




          </div>
        ))}
      </div>

      {showTaskDetails && selectedTask && (
        <ViewTaskModal
          taskDescription={selectedTask.task_name}
          taskStatus={selectedTask.status}
          assignedToUserName={selectedTask.assignedToUserName}
          assignmentId={selectedTask.task_id}
          token={token!}
          onClose={handleCloseTaskModal}
        />
      )}

      {showUpdateTaskModal && taskToUpdate && (
        <ModalUpdateTask
          currentStatus={taskToUpdate.status}
          onUpdateStatus={(newStatus) => handleUpdateTaskStatus(taskToUpdate.task_id, newStatus)}
          onClose={() => setShowUpdateTaskModal(false)}
        />
      )}
    </div>
  );
};

export default Board;
