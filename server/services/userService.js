const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Role = require("../models/role");
const Major = require("../models/major");

router.get("/", async (_, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
        {
          model: Major,
          attributes: ["name"],
        },
      ],
    });
    const response = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      role: user.Role?.name,
      major: user.Major?.name || "None",
    }));
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
        {
          model: Major,
          attributes: ["name"],
        },
      ],
    });

    if (!user || password !== user.password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role?.name,
        number: user.student_number,
        year: user.class_year,
        major: user.Major?.name || "None",
        tel: user.tel,
      },
    });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
