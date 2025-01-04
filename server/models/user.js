const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Role = require('./role');
const Major = require('./major');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  },
  student_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  class_year: {
    type: DataTypes.STRING,
  },
  tel: {
    type: DataTypes.STRING,
  },
  major_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'majors',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE
  },
  role_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',
      key: 'id'
    }
  }
}, {
  tableName: 'users',
  timestamps: false,
});

User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

User.belongsTo(Major, { foreignKey: 'major_id' });
Major.hasMany(User, { foreignKey: 'major_id' });

module.exports = User;
