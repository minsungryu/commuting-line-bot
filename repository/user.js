exports.findAll = () => {
  return {
    name: "find-user-all",
    text: "SELECT * FROM account WHERE deleted = false",
    values: []
  };
};

exports.findById = userId => {
  return {
    name: "find-user-by-id",
    text: "SELECT * FROM account WHERE user_id = $1",
    values: [userId]
  };
};

exports.findByAttendanceTime = time => {
  return {
    name: "find-user-by-attendance-time",
    text:
      "SELECT * FROM account WHERE attendance_time = $1 and deleted = false",
    values: [time]
  };
};

exports.findByLeaveTime = time => {
  return {
    name: "find-user-by-leave-time",
    text: "SELECT * FROM account WHERE leave_time = $1 and deleted = false",
    values: [time]
  };
};

exports.insertUser = userId => {
  return {
    name: "insert-user",
    text: "INSERT INTO account(user_id) VALUES($1)",
    values: [userId]
  };
};

exports.activateUser = userId => {
  return {
    name: "activate-user",
    text: "UPDATE account SET deleted = false WHERE user_id = $1",
    values: [userId]
  };
};

exports.deleteUser = userId => {
  return {
    name: "delete-user",
    text: "UPDATE account SET deleted = true WHERE user_id = $1",
    values: [userId]
  };
};

exports.extractUserIds = (result) => {
  return result.rows.map(user => user["user_id"]);
};

exports.findAdmin = () => {
  return {
    name: "find-admin-user",
    text: "SELECT * FROM account WHERE admin = $1",
    values: [true]
  };
};