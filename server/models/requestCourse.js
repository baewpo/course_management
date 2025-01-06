const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Course = require('./course');
const User = require('./user');

const ActionRequestType = Object.freeze({
  ADD: "add",
  DROP: "drop"
});

const StatusType = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
});

const RequestCourse = sequelize.define(
  "RequestCourse",
  {
    type: {
      type: DataTypes.ENUM(...Object.values(ActionRequestType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StatusType)),
      values: ['pending', 'approved', 'rejected'],
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
  }, {
    tableName: "request_courses",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

RequestCourse.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(RequestCourse, { foreignKey: 'course_id' });

RequestCourse.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(RequestCourse, { foreignKey: 'user_id' });

module.exports = RequestCourse;
