const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define(
	"Role",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "roles",
		timestamps: false,
		schema: "course",
	}
)

module.exports = Role;
