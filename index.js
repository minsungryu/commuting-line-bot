require("dotenv").config();

const express = require("express");
const controller = require("./controller");
const { modayAttendanceJob, weekdayAttendanceJob, leaveJob, healthCheck } = require("./scheduler");
const app = express();

app.use(express.json());
app.use("/", controller);

modayAttendanceJob();
weekdayAttendanceJob();
leaveJob();
healthCheck();

app.listen(process.env.PORT, () => console.log("Server is running"));
