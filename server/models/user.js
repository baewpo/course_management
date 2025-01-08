const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")
const Role = require("./role")
const Major = require("./major")

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		studentNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			field: "student_number",
		},
		email: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
		classYear: {
			type: DataTypes.STRING,
			field: "class_year",
		},
		tel: {
			type: DataTypes.STRING,
		},
		majorId: {
			type: DataTypes.INTEGER,
			references: {
				model: "majors",
				key: "id",
			},
			field: "major_id",
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "created_at",
		},
		roleId: {
			type: DataTypes.INTEGER,
			references: {
				model: "roles",
				key: "id",
			},
			field: "role_id",
		},
	},
	{
		tableName: "users",
		timestamps: false,
	}
)

User.belongsTo(Role, { foreignKey: "roleId", as: "role" })
Role.hasMany(User, { foreignKey: "roleId" })

User.belongsTo(Major, { foreignKey: "majorId", as: "major" })
Major.hasMany(User, { foreignKey: "majorId" })

module.exports = User
