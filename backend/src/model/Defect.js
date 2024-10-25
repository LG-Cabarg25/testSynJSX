// src/models/Defect.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Defect = sequelize.define('Defect', {
  defect_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  defect_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Returned', 'Approved', 'Rejected'),
    defaultValue: 'Returned'
  },
  test_case_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Defects',
  timestamps: false
});

export default Defect;
