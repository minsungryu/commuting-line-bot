require('dotenv').config();

const express = require('express');
const controller = require('./controller');
const { woowaAttendanceJob, woowaLeaveJob } = require('./scheduler');
const app = express();

app.use(express.json());
app.use('/', controller);

woowaAttendanceJob();
woowaLeaveJob();

app.listen(3000, () => console.log('Server is running'));