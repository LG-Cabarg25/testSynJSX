import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const TestCases = sequelize.define('TestCases', {
  test_case_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  test_plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  project_role_id: {  // Cambiado de tester_id a project_role_id
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Passed', 'Failed', 'Pending'),
    defaultValue: 'Pending',
    allowNull: false
  },
  priority: {  // Agregada la columna de prioridad
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  tableName: 'Test_Cases',
  timestamps: false
});

export default TestCases;
