require('dotenv').config();

const express = require('express');
const controller = require('./controller');
const { attendanceJob, leaveJob } = require('./scheduler');
const app = express();

app.use(express.json());
app.use('/', controller);

attendanceJob();
leaveJob();

app.listen(3000, () => console.log('Server is running'));