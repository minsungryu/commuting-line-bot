const env = process.env;

const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: env.LINE_CHANNEL_SECRET
};

const WEBHOOK_TEST_REPLY_TOKENS = new Set(['00000000000000000000000000000000', 'ffffffffffffffffffffffffffffffff']);
const WEBHOOK_TEST_USER_ID = 'Udeadbeefdeadbeefdeadbeefdeadbeef';
const REQUEST_THRESHOLD = 150;

const client = new line.Client(config);

function pushMessage(userId, text) {
  if (WEBHOOK_TEST_USER_ID === userId) {
    return Promise.resolve();
  }
  
  return client.pushMessage(userId, {
    type: "text",
    text: text
  });
};

function replyMessage(replyToken, text) {
  if (WEBHOOK_TEST_REPLY_TOKENS.has(replyToken)) {
    return Promise.resolve();
  }

  return client.replyMessage(replyToken, {
    type: "text",
    text: text
  });
};

function multicastMessage(userIds, text) {
  if (REQUEST_THRESHOLD < userIds.length) {
    throw Error("최대 150명까지만 전송할 수 있습니다");
  }

  return client.multicast(userIds, {
    type: "text",
    text: text
  });
};

module.exports = {
  REQUEST_THRESHOLD,
  client,
  pushMessage,
  replyMessage,
  multicastMessage
};