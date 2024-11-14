// backend/db.js

const { Sequelize } = require('sequelize');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Database file location
});

module.exports = sequelize;
