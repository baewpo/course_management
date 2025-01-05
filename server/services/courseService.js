const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");
const RequestCourse = require("../models/requestCourse");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
	try {
		const { course_code } = req.query;
		const whereCondition = course_code
			? {
					course_code: {
						[Op.iLike]: course_code.trim(),
					},
			  }
			: {};
		const courses = await Course.findAll({ where: whereCondition });

		if (!courses.length) {
			return res.status(400).json({ message: "No courses found." });
		}

		res.json(courses);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error." });
	}
});

router.post("/request/create", async (req, res) => {
	const requests = req.body;
	const validTypes = ["add", "drop"];

	if (!requests?.length)
		return res.status(400).json({ message: "No requests provided!" });

	try {
		const createdRequests = await Promise.all(
			requests.map(({ type, course_id, user_id }) => {
				if (!validTypes.includes(type) || !course_id || !user_id) {
					throw new Error("Invalid request data.");
				}
				return RequestCourse.create({
					type,
					course_id,
					user_id,
					status: "pending",
				});
			})
		);
		res.json({
			message: "Requests created successfully!",
			data: createdRequests,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error creating requests" });
	}
});

router.get("/request/user/:userId", async (req, res) => {
	try {
	  const { userId } = req.params;
	  const { status, course_code, type } = req.query;

	  const requestCourses = await RequestCourse.findAll({
		where: {
		  user_id: userId,
		  ...(status && { status: { [Op.in]: status.split(",") } }),
		},
		include: {
		  model: Course,
		  attributes: ["id", "name", "course_code", "description"],
		  where: course_code && { course_code: { [Op.iLike]: course_code } },
		},
	  });

	  if (!requestCourses.length) {
		return res.status(404).json({ message: "No request courses found" });
	  }

	  res.json(requestCourses.map(({ id, type, status, created_at, updated_at, Course }) => ({
		id, type, status, created_at, updated_at, Course,
	  })));
	} catch (error) {
	  res.status(500).json({ message: "Error retrieving request courses", error: error.message });
	}
  });

router.put("/request/update-status", async (req, res) => {
	const requests = req.body;
	if (!requests?.length)
		return res.status(400).json({ message: "No requests provided!" });
	try {
		const validStatuses = ["pending", "approved", "rejected"];
		const updatedRequests = await Promise.all(
			requests.map(async ({ id, status }) => {
				if (!id || !validStatuses.includes(status))
					throw new Error("Invalid request data.");
				const request = await RequestCourse.findByPk(id);
				if (!request) throw new Error(`Request with id ${id} not found.`);
				return request.update({ status });
			})
		);
		res.json({
			message: "Requests updated successfully!",
			data: updatedRequests,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: error.message || "Error updating requests",
		});
	}
});

module.exports = router;
