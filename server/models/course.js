const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Course = sequelize.define(
  "Course",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'course_code'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    instructor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "courses",
    timestamps: false,
  }
);

module.exports = Course;
