const express = require("express");
const router = express.Router();

const { webhookHandler } = require("./webhook.controller");

router.post("/webhook", webhookHandler);

module.exports = router;