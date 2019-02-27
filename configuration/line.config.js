const env = process.env;

const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: env.LINE_CHANNEL_SECRET
};

const REQUEST_THRESHOLD = 150;

const client = new line.Client(config);

function pushMessage(userId, text) {
  return client.pushMessage(userId, {
    type: "text",
    text: text
  });
};

function replyMessage(replyToken, text) {
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

function multicastUsers(userIds, text) {
  if (userIds.length === 0) {
    console.log("No user");
    return;
  }

  const requests = [];
  const maxTry = parseInt(userIds.length / REQUEST_THRESHOLD + 1);

  for (let i = 0; i < maxTry; i++) {
    const slice = userIds.slice(
      i * REQUEST_THRESHOLD,
      (i + 1) * REQUEST_THRESHOLD
    );
    requests.push(multicastMessage(slice, text));
  }

  return Promise.all(requests);
}

module.exports = {
  REQUEST_THRESHOLD,
  client,
  pushMessage,
  replyMessage,
  multicastMessage,
  multicastUsers
};