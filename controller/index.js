const express = require('express');
const router = express.Router();

const { webhookHealth, webhookHandler } = require('./webhook.controller');

router.get('/webhook', webhookHealth);
router.post('/webhook', webhookHandler);

module.exports = router;