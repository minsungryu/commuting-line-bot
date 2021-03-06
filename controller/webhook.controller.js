const { pushMessage, replyMessage, multicastUsers } = require("../configuration/line.config");
const { pool } = require("../configuration/database.config");
const {
  findAll,
  findById,
  insertUser,
  activateUser,
  deleteUser,
  extractUserIds
} = require("../repository/user");

exports.webhookHandler = (req, res) => {
  const destination = req.body.destination;
  const events = req.body.events;

  console.log(destination, events);
  if (!destination) { // It means line-dev webhook test
    return res.sendStatus(200);
  }

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

exports.attendancePushHandler = (req, res) => {
  pool
      .query(findAll())
      .then(result =>
        multicastUsers(
          extractUserIds(result),
          "췍! 출근하셨다면 출근버튼을 꼭 눌러주세요~"
        )
      )
      .then(responses => {
        console.log("[FORCE] Attendance alarm succeed");
        res.sendStatus(200);
      })
      .catch(err => {
        console.error(err.stack);
        res.sendStatus(500);
      });
};

exports.leavePushHandler = (req, res) => {
    pool
      .query(findAll())
      .then(result =>
        multicastUsers(
          extractUserIds(result),
          "오늘 하루도 우아했나요? 퇴근하시기 전에 퇴근버튼 꾹! 잊지마세요~"
        )
      )
      .then(responses => {
        console.log("[FORCE] Leave alarm succeed");
        res.sendStatus(200);
      })
      .catch(err => {
        console.error(err.stack);
        res.sendStatus(500);
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
  return pushMessage(source.userId, "현재 대화기능은 제공하고 있지 않습니다");
}

function greeting(userId) {
  return pushMessage(userId, "친구추가 해주셔서 감사합니다!");
}