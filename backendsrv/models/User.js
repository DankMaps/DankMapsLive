// backend/models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING, // In production, passwords should be hashed
});

module.exports = User;
