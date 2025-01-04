const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/db");
const userRoutes = require("./services/userService");
const courseRoutes = require("./services/courseService");

// require('dotenv').config();

const app = express();
const PORT = 8080;

app.use(cors()); // เพื่ออนุญาตการเข้าถึงจากโดเมนอื่น
app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

  // sequelize.sync({ force: false })  // force: false จะไม่ลบข้อมูลในฐานข้อมูล
  // .then(() => {
  //   console.log('Database synced');
  // })
  // .catch((err) => console.error('Error syncing database:', err));


app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
