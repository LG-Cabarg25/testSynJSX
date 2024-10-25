import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  registerProject,
  getProjectsByUser,
  getProjectById,
  updatedProject,
  updatedProjectRoles,
  deletedProject,
  registerProjectRoles,
  deletedProjectRoles,
  getProjectsAssignedAndCreatedByUser,
  listProjectRoles,
  checkProjectNameExists, // Importamos el controlador para verificar si el nombre existe
  listUsersAssignedToProject,
  getProjectAssignments,
  getProjectResults
} from '../controller/ProjectsController.js';

const router = Router();

// Ruta para verificar si un proyecto con un nombre ya existe
router.get('/check/:project_name', verifyToken, checkProjectNameExists);

// Ruta para obtener todos los proyectos asociados a un usuario específico (creados y asignados)
router.get('/user/:userId/assigned', verifyToken, getProjectsAssignedAndCreatedByUser);

// Registrar un nuevo proyecto
router.post('/register', verifyToken, registerProject);

// Obtener todos los proyectos creados por un usuario
router.get('/user/:userId', verifyToken, getProjectsByUser);

// Obtener un proyecto específico por su ID
router.get('/:p_project_id', verifyToken, getProjectById);

// Registrar roles en un proyecto
router.post('/register-project-roles/:p_project_id', verifyToken, registerProjectRoles);

// Actualizar un proyecto existente y su equipo por su ID
router.put('/update/:p_project_id', verifyToken, updatedProject);

// Actualizar un rol en un proyecto por su ID
router.put('/project-role/update/:p_project_role_id', verifyToken, updatedProjectRoles);

// Eliminar un proyecto específico por su ID
router.delete('/delete/:p_project_id', verifyToken, deletedProject);

// Eliminar un rol en un proyecto
router.delete('/delete-project-roles/:p_project_role_id', verifyToken, deletedProjectRoles);

// Obtener todos los roles de un proyecto por su ID
router.get('/:p_project_id/roles', verifyToken, listProjectRoles);

router.get('/:p_project_id/users', verifyToken, listUsersAssignedToProject);
router.get('/:p_project_id/tasks', verifyToken, getProjectAssignments);

router.get('/:projectId/results', getProjectResults);

export default router;
