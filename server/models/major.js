const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Major = sequelize.define('Major', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'majors',
  timestamps: false,
});

module.exports = Major;
