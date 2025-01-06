const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Role = require("../models/role")
const Major = require("../models/major")

router.post("/login", async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({
			where: { email },
			include: [
				{
					model: Role,
					attributes: ["name"],
					as: "role",
				},
				{
					model: Major,
					attributes: ["name"],
					as: "major",
				},
			],
		})

		if (!user || password !== user.password) {
			return res.status(400).json({ message: "Invalid email or password." })
		}

		delete user.dataValues.password

		res.json({
			message: "Login successful.",
			user: user,
		})
	} catch (err) {
		console.error(err.message)
	}
})

module.exports = router
