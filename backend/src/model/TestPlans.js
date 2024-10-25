import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const TestPlans = sequelize.define('TestPlans', {
  test_plan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  plan_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  plan_type: { // Nuevo campo para tipo de plan
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: { // Nuevo campo para descripción general
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_date: { // Nuevo campo para fecha de inicio
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: { // Nuevo campo para fecha límite
    type: DataTypes.DATE,
    allowNull: true
  },
  document: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In progress', 'Completed'),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE, // Asegúrate de que el tipo sea DATE
    allowNull: false,
    defaultValue: DataTypes.NOW // Agrega un valor por defecto de la fecha actual
  }
}, {
  tableName: 'Test_Plans',
  timestamps: false // Ya que no estás utilizando los campos `createdAt` y `updatedAt` por defecto de Sequelize
});

export default TestPlans;
