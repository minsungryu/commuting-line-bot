const { replyMessage } = require("../configuration/line.config");
const { pool } = require("../configuration/database.config");
const {
  findById,
  insertUser,
  activateUser,
  deleteUser
} = require("../repository/user");

exports.webhookHandler = (req, res) => {
  const destination = req.body.destination;
  const events = req.body.events;

  if (!destination) { // It means line-dev webhook test
    return res.sendStatus(200);
  }
  
  console.log(events);
  const requests = events.map(({ type, source }) => {
    switch (type) {
      case "follow":
        return createFollowUser(source);
      case "unfollow":
        return deleteUnfollowUser(source);
      case "message":
        return alertNotSupportMessage(source);
    }
  });

  Promise.all(requests)
    .then(responses => {
      console.log(responses);
      return res.sendStatus(200);
    })
    .catch(errors => {
      console.error(errors);
      return res.sendStatus(500);
    });
};

function createFollowUser(source) {
  if (source.type !== "user") {
    return;
  }

  const userId = source.userId;
  return pool.query(findById(userId)).then(result => {
    const userQuery = result.rows.length ? activateUser : insertUser;
    return pool.query(userQuery(userId)).then(result => greeting(userId));
  });
}

function deleteUnfollowUser(source) {
  const userId = source.userId;
  return pool.query(deleteUser(userId));
}

function alertNotSupportMessage(source) {
  return replyMessage(source.replyToken, "현재 대화기능은 제공하고 있지 않습니다");
}

function greeting(userId) {
  return pushMessage(userId, "친구추가 해주셔서 감사합니다!");
}
