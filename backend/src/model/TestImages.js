import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const TestImages = sequelize.define('TestImages', {
  test_image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  test_case_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  }
}, {
  tableName: 'Test_Images',
  timestamps: false
});

export default TestImages;
