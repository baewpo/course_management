const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")
const Course = require("./course")
const User = require("./user")

const ActionRequestType = Object.freeze({
	ADD: "add",
	DROP: "drop",
})

const StatusType = Object.freeze({
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected",
})

const RequestCourse = sequelize.define(
	"RequestCourse",
	{
		type: {
			type: DataTypes.ENUM(...Object.values(ActionRequestType)),
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(StatusType)),
			values: ["pending", "approved", "rejected"],
			allowNull: false,
		},
		courseId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "courses",
				key: "id",
			},
			field: "course_id",
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			field: "user_id",
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "created_at",
		},
		updatedAt: {
			type: DataTypes.DATE,
			field: "updated_at",
		},
	},
	{
		tableName: "request_courses",
		timestamps: true,
	}
)

RequestCourse.belongsTo(Course, { foreignKey: "courseId", as: "course"})
Course.hasMany(RequestCourse, { foreignKey: "courseId" })

RequestCourse.belongsTo(User, { foreignKey: "userId" })
User.hasMany(RequestCourse, { foreignKey: "userId" })

module.exports = RequestCourse
