import { Sequelize } from 'sequelize';

export const bd = 'testsync';
export const user = 'root';
export const password = 'guss123';
export const host = 'localhost';
export const port = '3306';

// Crear la instancia de Sequelize
const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  logging: false, // Deshabilitar el logging si no quieres ver las consultas SQL en la consola
});

// Exportar la instancia de Sequelize como default
export default sequelize;