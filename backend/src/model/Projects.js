import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Users from './Users.js';

const Projects = sequelize.define('Projects', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('In Progress', 'Completed', 'Pending'),
    defaultValue: 'Pending',
    allowNull: false
  },
  pm_id: {
    type: DataTypes.INTEGER,  // Cambiado a INTEGER para referenciar a la tabla de usuarios
    allowNull: false,
    references: {
      model: Users,  // Establece la relación con el modelo Users
      key: 'user_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,  // Cambiado a DATE para almacenar la fecha de creación
    allowNull: false,
    defaultValue: Sequelize.NOW  // Establece automáticamente la fecha y hora actual
  }
}, {
  tableName: 'Projects',
  timestamps: false  // Si no necesitas los campos updatedAt y createdAt automáticos
});

// Relación con Users
Projects.belongsTo(Users, { foreignKey: 'pm_id', as: 'project_manager' });

export default Projects;
