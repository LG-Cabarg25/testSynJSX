import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const ProjectAssignmentsComments = sequelize.define('Project_Assignments_Comments', {
  project_assignments_comments_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'Project_Assignments_Comments', // Cambiado de 'Meetings' a 'Project_Assignments_Comments'
  timestamps: false  // Si no necesitas los campos updatedAt y createdAt automáticos
});

export default ProjectAssignmentsComments;
