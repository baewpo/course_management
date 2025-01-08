const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/db");
const userRoutes = require("./services/userService");
const courseRoutes = require("./services/courseService");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
