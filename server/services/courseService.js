const express = require("express")
const router = express.Router()
const Course = require("../models/course")
const RequestCourse = require("../models/requestCourse")
const User = require("../models/user")
const { Op } = require("sequelize")
const { pagable } = require("../utils/pagination")

router.get("/", async (req, res) => {
	try {
		const { courseCode } = req.query
		const condition = courseCode && {
			courseCode: {
				[Op.iLike]: courseCode.trim(),
			},
		}
		const courses = await Course.findAll({ where: condition })
		if (!courses.length) {
			return res.status(404).json({ message: "No courses found." })
		}
		res.json(courses)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Server error." })
	}
})

router.post("/request/create", async (req, res) => {
	const requests = req.body
	const validTypes = ["add", "drop"]

	if (!requests?.length) return res.status(400).json({ message: "No requests provided!" })

	try {
		const createdRequests = await Promise.all(
			requests.map(({ type, courseId, userId }) => {
				if (!validTypes.includes(type) || !courseId || !userId) {
					throw new Error("Invalid request data.")
				}
				return RequestCourse.create({
					type,
					courseId,
					userId,
					status: "pending",
				})
			})
		)
		res.json({
			message: "Requests created successfully!",
			data: createdRequests,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Error creating requests" })
	}
})

router.get("/request/user/:userId", async (req, res) => {
	try {
		const { userId } = req.params
		const { status, courseCode, type } = req.query

		const conditions = {
			userId,
			...(status && {
				status: {
					[Op.in]: status.split(",").map((statusItem) => statusItem.trim().toLowerCase()),
				},
			}),
			...(courseCode && {
				[Op.or]: courseCode.split(",").map((code) => ({
					"$course.course_code$": {
						[Op.iLike]: code.trim(),
					},
				})),
			}),
			...(type && {
				type: {
					[Op.eq]: type.trim().toLowerCase(),
				},
			}),
		}

		const result = await pagable({
			model: RequestCourse,
			conditions: conditions,
			include: [
				{
					model: Course,
					as: "course",
					attributes: ["id", "name", "courseCode", "description"],
				},
			],
			reqQuery: req.query,
		})
		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Error retrieving request courses", error: error.message })
	}
})

router.put("/request/update-status", async (req, res) => {
	const requests = req.body
	if (!requests?.length) return res.status(400).json({ message: "No requests provided!" })
	try {
		const validStatuses = ["pending", "approved", "rejected"]
		const updatedRequests = await Promise.all(
			requests.map(async ({ id, status }) => {
				if (!id || !validStatuses.includes(status)) throw new Error("Invalid request data.")
				const request = await RequestCourse.findByPk(id)
				if (!request) throw new Error(`Request with id ${id} not found.`)
				return request.update({ status })
			})
		)
		res.json({
			message: "Requests updated successfully!",
			data: updatedRequests,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			message: error.message || "Error updating requests",
		})
	}
})

router.delete("/request/:requestId", async (req, res) => {
	try {
		const { requestId } = req.params
		const request = await RequestCourse.findByPk(requestId)
		if (!request) {
			return res.status(404).json({ message: `Request with id ${requestId} not found.` })
		}
		await request.destroy()
		res.status(200).json({
			message: `Request with id ${requestId} has been successfully deleted.`,
		})
	} catch (error) {
		res.status(500).json({
			message: error.message || "An error occurred while deleting the request.",
		})
	}
})

router.get("/request", async (req, res) => {
	try {
		const { status, courseCode, type } = req.query

		const conditions = {
			...(status && {
				status: {
					[Op.in]: status.split(",").map((statusItem) => statusItem.trim().toLowerCase()),
				},
			}),
			...(courseCode && {
				[Op.or]: courseCode.split(",").map((code) => ({
					"$course.course_code$": {
						[Op.iLike]: code.trim(),
					},
				})),
			}),
			...(type && {
				type: {
					[Op.eq]: type.trim().toLowerCase(),
				},
			}),
		}

		const result = await pagable({
			model: RequestCourse,
			conditions: conditions,
			include: [
				{
					model: Course,
					as: "course",
					attributes: ["id", "name", "courseCode", "description"],
				},
				{
					model: User,
					as: "user",
					attributes: ["id", "name"],
				},
			],
			reqQuery: req.query,
		})
		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Error retrieving request courses", error: error.message })
	}
})

module.exports = router
