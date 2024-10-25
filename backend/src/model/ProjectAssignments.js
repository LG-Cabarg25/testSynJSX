import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const ProjectAssignments = sequelize.define('Project_Assignments', {
  assignment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  project_role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name_task: {  // Nuevo campo
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('To do', 'In progress', 'In review', 'In testing', 'Approved', 'Returned', 'Rejected'),
    allowNull: false
  }
}, {
  tableName: 'Project_Assignments',
  timestamps: false
});

export default ProjectAssignments;
