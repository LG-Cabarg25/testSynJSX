import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Projects from './Projects.js'

const Meetings = sequelize.define('Meetings', {
  meeting_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  meeting_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  meeting_start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  meeting_end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  meeting_status: {
    type: DataTypes.ENUM('Pending', 'Completed'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  meeting_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  meeting_link: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'Meetings',
  timestamps: false  // Si no necesitas los campos updatedAt y createdAt automáticos
});

export default Meetings;
