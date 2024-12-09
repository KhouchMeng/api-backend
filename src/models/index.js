// models/index.js
import { Sequelize } from 'sequelize';
import config from '../config/config.json' assert { type: 'json' };

// Extract the development configuration
const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, dialect } = config[env];


// Initialize Sequelize
const sequelize = new Sequelize(database, username, password, {
  host ,
  dialect,
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
