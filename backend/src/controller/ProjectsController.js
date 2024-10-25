import Projects from '../model/Projects.js';
import sequelize from '../database/database.js';

// Registrar un proyecto (sin roles)
export const registerProject = async (req, res, next) => {
  try {
    const { p_project_name, p_description, p_start_date, p_end_date, p_status } = req.body;
    const p_pm_id = req.userId; // Aquí usas req.userId que es asignado en el middleware

    if (!p_project_name || !p_description || !p_start_date || !p_end_date || !p_status || !p_pm_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    await Projects.sequelize.query(
      'CALL procedure_to_register_projects(:p_project_name, :p_description, :p_start_date, :p_end_date, :p_status, :p_pm_id)', 
      {
        replacements: { p_project_name, p_description, p_start_date, p_end_date, p_status, p_pm_id }
      }
    );

    res.status(201).json({ message: 'Proyecto registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Registrar roles de proyecto (independiente de la creación del proyecto)
export const registerProjectRoles = async (req, res, next) => {
  try {
    const { p_project_id } = req.params;
    const { p_team_roles } = req.body;

    if (!p_team_roles || p_team_roles.length === 0) {
      return res.status(400).json({ message: 'Los roles del equipo no pueden estar vacíos.' });
    }

    const teamRolesJSON = JSON.stringify(p_team_roles);
    await Projects.sequelize.query('CALL procedure_to_register_project_roles(:p_project_id, :p_team_roles)', {
      replacements: { p_project_id, p_team_roles: teamRolesJSON }
    });

    res.status(201).json({ message: 'Roles del proyecto registrados exitosamente' });
  } catch (error) {
    console.error('Error al registrar roles del proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener proyectos por usuario
export const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'El userId es obligatorio.' });
    }

    const projects = await Projects.findAll({
      where: { pm_id: userId }
    });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No se encontraron proyectos para este usuario.' });
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos por usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener proyectos creados y asignados al usuario
export const getProjectsAssignedAndCreatedByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'El userId es obligatorio.' });
    }

    // Buscar proyectos donde el usuario es el Project Manager
    const createdProjects = await Projects.findAll({
      where: { pm_id: userId }
    });

    // Buscar proyectos donde el usuario está asignado como miembro del equipo
    const assignedProjects = await Projects.sequelize.query(
      `SELECT * FROM Projects p 
       JOIN Project_Roles r ON p.project_id = r.project_id 
       WHERE r.user_id = :userId`,
      {
        replacements: { userId },
        type: Projects.sequelize.QueryTypes.SELECT
      }
    );

    const allProjects = [...createdProjects, ...assignedProjects];

    if (allProjects.length === 0) {
      return res.status(404).json({ message: 'No se encontraron proyectos para este usuario.' });
    }

    return res.status(200).json(allProjects);
  } catch (error) {
    console.error('Error al obtener proyectos creados y asignados al usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (req, res) => {
  try {
    const { p_project_id } = req.params;

    if (!p_project_id) {
      return res.status(400).json({ message: 'El ID del proyecto es obligatorio.' });
    }

    const project = await Projects.findOne({ where: { project_id: p_project_id } });

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    // Verifica si los roles están presentes y asegúrate de enviar los datos correctos
    const projectWithRoles = {
      ...project.toJSON(),
      roles: project.roles ? JSON.parse(project.roles) : [] // Convertir roles si están en JSON
    };

    return res.status(200).json(projectWithRoles);
  } catch (error) {
    console.error('Error al obtener los detalles del proyecto:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar un proyecto
export const updatedProject = async (req, res) => {
  try {
    const { p_project_id } = req.params;
    const { p_project_name, p_description, p_start_date, p_end_date, p_status } = req.body;

    // Crear un objeto con los campos que se quieren actualizar, ignorando los que no están en la solicitud
    const fieldsToUpdate = {};
    if (p_project_name) fieldsToUpdate.project_name = p_project_name;
    if (p_description) fieldsToUpdate.description = p_description;
    if (p_start_date) fieldsToUpdate.start_date = p_start_date;
    if (p_end_date) fieldsToUpdate.end_date = p_end_date;
    if (p_status) fieldsToUpdate.status = p_status;

    // Validar si hay campos para actualizar
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
    }

    // Ejecutar la consulta de actualización
    await Projects.update(fieldsToUpdate, { where: { project_id: p_project_id } });

    res.status(200).json({ message: 'Proyecto actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Actualizar un rol del equipo
export const updatedProjectRoles = async (req, res) => {
  try {
    const { p_project_role_id } = req.params;
    const { p_role } = req.body;

    // Ejecutar la llamada al procedimiento almacenado
    await Projects.sequelize.query('CALL procedure_to_updated_project_roles(:p_project_role_id, :p_role)', {
      replacements: { p_project_role_id, p_role }
    });

    res.status(200).json({ message: 'Rol de equipo actualizados exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el proyecto y el equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Eliminar un proyecto
export const deletedProject = async (req, res, next) => {
  try {
    const { p_project_id } = req.params;

    if (!p_project_id) {
      return res.status(400).json({ message: 'El ID del proyecto es obligatorio.' });
    }

    // Llamada al procedimiento almacenado para eliminar el proyecto y sus roles
    await Projects.sequelize.query('CALL procedure_to_deleted_projects(:p_project_id)', {
      replacements: { p_project_id }
    });

    res.status(200).json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Eliminar un rol de proyecto
export const deletedProjectRoles = async (req, res, next) => {
  try {
    const { p_project_role_id } = req.params;

    if (!p_project_role_id) {
      return res.status(400).json({ message: 'El ID del rol de proyecto es obligatorio.' });
    }

    await Projects.sequelize.query('CALL procedure_to_deleted_project_roles(:p_project_role_id)', {
      replacements: { p_project_role_id }
    });

    res.status(200).json({ message: 'Rol de proyecto eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el rol de proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar el rol de proyecto.' });
  }
};


// Listar roles de un proyecto
export const listProjectRoles = async (req, res) => {
  try {
    const { p_project_id } = req.params; // Obtén el ID del proyecto desde los parámetros de la solicitud

    if (!p_project_id) {
      return res.status(400).json({ message: 'El ID del proyecto es obligatorio.' });
    }

    // Ejecutar la llamada al procedimiento almacenado para listar los roles
    const roles = await Projects.sequelize.query(
      'CALL procedure_to_list_project_roles(:p_project_id)',
      {
        replacements: { p_project_id }
      }
    );

    if (roles.length === 0) {
      return res.status(404).json({ message: 'No se encontraron roles para este proyecto.' });
    }

    return res.status(200).json(roles);
  } catch (error) {
    console.error('Error al listar roles de proyecto:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Verificar si un proyecto ya existe por nombre
export const checkProjectNameExists = async (req, res) => {
  const { project_name } = req.params;

  try {
    const project = await Projects.findOne({ where: { project_name } });

    if (project) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error('Error al verificar el nombre del proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Listar los usuarios asignados a un proyecto
export const listUsersAssignedToProject = async (req, res) => {
  try {
    const { p_project_id } = req.params; // Obtener el ID del proyecto de los parámetros

    if (!p_project_id) {
      return res.status(400).json({ message: 'El ID del proyecto es obligatorio.' });
    }

    // Ejecutar la llamada al procedimiento almacenado para listar los usuarios asignados
    const users = await Projects.sequelize.query(
      'CALL procedure_to_list_user_projects(:p_project_id)',
      {
        replacements: { p_project_id }
      }
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios asignados a este proyecto.' });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error al listar los usuarios asignados al proyecto:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener las tareas de un proyecto específico
export const getProjectAssignments = async (req, res) => {
  try {
    const { p_project_id } = req.params; // Obtener el ID del proyecto desde los parámetros de la ruta

    // Verificar si el ID del proyecto está presente y es válido
    if (!p_project_id || isNaN(p_project_id)) {
      return res.status(400).json({ message: 'El ID del proyecto es requerido y debe ser un número válido.' });
    }

    // Llamar al procedimiento almacenado para obtener las tareas del proyecto
    const projectAssignments = await Projects.sequelize.query(
      'CALL procedure_to_get_project_assignments(:p_project_id)',
      {
        replacements: { p_project_id },
      }
    );

    // Enviar las tareas como respuesta
    res.status(200).json(projectAssignments);
  } catch (error) {
    console.error('Error al obtener las tareas del proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



export const getProjectResults = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Ejecutar cada consulta SQL
    const [projectInfo] = await sequelize.query(`
      SELECT project_name, description, start_date, end_date, status
      FROM Projects
      WHERE project_id = :projectId
    `, { replacements: { projectId }, type: sequelize.QueryTypes.SELECT });

    const testPlans = await sequelize.query(`
      SELECT plan_name, COUNT(tc.test_case_id) AS total_test_cases,
        SUM(tc.status = 'Passed') AS passed_test_cases,
        SUM(tc.status = 'Failed') AS failed_test_cases
      FROM Test_Plans tp
      LEFT JOIN Test_Cases tc ON tp.test_plan_id = tc.test_plan_id
      WHERE tp.project_id = :projectId
      GROUP BY tp.plan_name
    `, { replacements: { projectId }, type: sequelize.QueryTypes.SELECT });

    const defects = await sequelize.query(`
      SELECT defect_description, severity, d.status
      FROM Defects d
      JOIN Test_Cases tc ON d.test_case_id = tc.test_case_id
      JOIN Test_Plans tp ON tc.test_plan_id = tp.test_plan_id
      WHERE tp.project_id = :projectId
    `, { replacements: { projectId }, type: sequelize.QueryTypes.SELECT });

    const assignments = await sequelize.query(`
      SELECT name_task, description, status
      FROM Project_Assignments
      WHERE project_id = :projectId
    `, { replacements: { projectId }, type: sequelize.QueryTypes.SELECT });

    const meetings = await sequelize.query(`
      SELECT meeting_date, meeting_start_time, meeting_end_time, meeting_status, meeting_description
      FROM Meetings
      WHERE project_id = :projectId
    `, { replacements: { projectId }, type: sequelize.QueryTypes.SELECT });

    // Enviar resultados sin duplicados ni ambigüedad
    res.json({
      projectInfo: projectInfo ? [projectInfo] : [],
      testPlans,
      defects,
      assignments,
      meetings
    });
  } catch (error) {
    console.error('Error al obtener los resultados del proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

