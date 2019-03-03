const schedule = require("node-schedule");
const moment = require("moment");

const { multicastUsers } = require("../configuration/line.config");
const { pool } = require("../configuration/database.config");
const {
  findAll,
  findByAttendanceTime,
  findByLeaveTime,
  extractUserIds
} = require("../repository/user");

const legalHoliday = require("./legal_holiday.json")

const DATE_FORMAT = "YYYY-MM-DD";
const TIME_FORMAT = "HH:mm";

const {
  CRON_ATTENDANCE_MONDAY,
  CRON_ATTENDANCE_WEEKDAY,
  CRON_LEAVE_WEEKDAY
} = process.env
/**
 * 1. 공유일 확인(TODO)
 * 2. 해당 시간에 출근하는 사람 확인해서 대기열 추가(TODO: 휴가제외)
 * 3. 해당 시간에 퇴근하는 사람 확인해서 대기열 추가(TODO: 휴가제외)
 * 4. 150명씩(max support) 나눠서 메시지 전송
 * 5. 10분, 15분, 30분뒤 다시 알림(TODO)
 */
exports.attendanceJob = () => {
  const ALARM_BEFORE = 10;
  schedule.scheduleJob(CRON_ATTENDANCE_MONDAY, () => {
    if (isLegalHoliday()) {
      console.log("Today is holiday");
      return;
    }
    
    pool
      .query(findAll())
      .then(result =>
        multicastUsers(
          extractUserIds(result),
          "췍! 출근하셨다면 출근버튼을 꼭 눌러주세요~1"
        )
      )
      .then(responses => console.log("Attendance alarm succeed"))
      .catch(err => console.error(err.stack));
  });

  schedule.scheduleJob(CRON_ATTENDANCE_WEEKDAY, () => {
    if (isLegalHoliday()) {
      console.log("Today is holiday");
      return;
    }
    const queryTime = moment()
      .add(ALARM_BEFORE, "minutes")
      .format(TIME_FORMAT);
    pool
      .query(findByAttendanceTime(queryTime))
      .then(result =>
        multicastUsers(
          extractUserIds(result),
          "췍! 출근하셨다면 출근버튼을 꼭 눌러주세요~2"
        )
      )
      .then(responses => console.log("Attendance alarm succeed"))
      .catch(err => console.error(err.stack));
  });
};

exports.leaveJob = () => {
  schedule.scheduleJob(CRON_LEAVE_WEEKDAY, () => {
    if (isLegalHoliday()) {
      console.log("Today is holiday");
      return;
    }

    const queryTime = moment().format(TIME_FORMAT);
    pool
      .query(findByLeaveTime(queryTime))
      .then(result =>
        multicastUsers(
          extractUserIds(result),
          "오늘 하루도 우아했나요? 퇴근하시기 전에 퇴근버튼 꾹! 잊지마세요~"
        )
      )
      .then(responses => console.log("Leave alarm succeed"))
      .catch(err => console.error(err.stack));
  });
};

function isLegalHoliday() {
  const today = moment().format(DATE_FORMAT);
  return legalHoliday.hasOwnProperty(today);
}