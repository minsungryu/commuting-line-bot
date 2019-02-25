const { pushMessage } = require("../configuration/line.config");
const { pool } = require("../configuration/database.config");
const {
  findById,
  insertUser,
  activateUser,
  deleteUser
} = require("../repository/user");

exports.webhookHandler = (req, res) => {
  const events = req.body.events;
  const works = events.map(event => {
    console.log(event);
    const { type, source } = event;
    switch (type) {
      case "follow":
        return createFollowUser(source, res);
      case "unfollow":
        return deleteUnfollowUser(source, res);
      case "message":
        return replyMessage(source, res);
    }
  });

  Promise.all(works)
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

function deleteUnfollowUser(source, res) {
  const userId = source.userId;
  return pool.query(deleteUser(userId));
}

function replyMessage(source, res) {
  return pushMessage(source.userId, "현재 대화기능은 제공하고 있지 않습니다");
}

function greeting(userId) {
  return pushMessage(userId, "친구추가 해주셔서 감사합니다!");
}
