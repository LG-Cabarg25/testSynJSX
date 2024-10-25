// En tu modelo ProjectRoles
import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';  // Tu conexión a la base de datos

class ProjectRoles extends Model {}

ProjectRoles.init({
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ProjectRoles',
});

export default ProjectRoles;

// Definir relaciones si aún no lo has hecho
import Users from './Users';
import Projects from './Projects';

// Un proyecto tiene muchos roles y usuarios
ProjectRoles.belongsTo(Users, { foreignKey: 'user_id' });
ProjectRoles.belongsTo(Projects, { foreignKey: 'project_id' });
