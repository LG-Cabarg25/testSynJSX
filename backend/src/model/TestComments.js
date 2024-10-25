import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const TestComments = sequelize.define('TestComments', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  test_case_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Test_Cases', // Nombre de la tabla de casos de prueba
      key: 'test_case_id'
    }
  },
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'commentsTestCase',
  timestamps: false
});

export default TestComments;
