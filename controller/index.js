const express = require("express");
const router = express.Router();

const { webhookHandler, attendancePushHandler, leavePushHandler } = require("./webhook.controller");

router.post("/webhook", webhookHandler);

router.get("/push/attendance/force", attendancePushHandler);
router.get("/push/leave/force", leavePushHandler);

module.exports = router;