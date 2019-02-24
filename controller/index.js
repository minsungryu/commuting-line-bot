const express = require('express');
const router = express.Router();

const { webhookHandler } = require('./webhook.controller');
router.post('/webhook', webhookHandler);

module.exports = router;


// app.post('/messages/attendance', (req, res) => {
//     // db get users
//     client.pushMessage('Ua282887c9230266442bca2d2d0033313', {
//         type: 'text',
//         text: '출근하셨나요? 출근버튼을 꼭 눌러주세요!'
//     }).then(response => {
//         console.log(response);
//         return res.sendStatus(200);
//     }).catch(error => {
//         console.error(error);
//         return res.sendStatus(400);
//     });
// });

// app.post('/messages/leave', (req, res) => {
//     // db get users
//     client.pushMessage('Ua282887c9230266442bca2d2d0033313', {
//         type: 'text',
//         text: '퇴근하셨나요? 퇴근버튼을 꼭 눌러주세요!'
//     }).then(response => {
//         console.log(response);
//         return res.sendStatus(200);
//     }).catch(error => {
//         console.error(error);
//         return res.sendStatus(400);
//     });
// });