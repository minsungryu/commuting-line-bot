require("dotenv").config();

const express = require("express");
const controller = require("./controller");
const { attendanceJob, leaveJob, healthCheck } = require("./scheduler");
const app = express();

app.use(express.json());
app.use("/", controller);

attendanceJob();
leaveJob();
healthCheck();

app.listen(process.env.PORT, () => console.log("Server is running"));
