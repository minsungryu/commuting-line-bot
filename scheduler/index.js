const schedule = require('node-schedule');
const moment = require('moment');

const { multicastMessage, REQUEST_THRESHOLD } = require('../configuration/line.config')
const { pool } = require('../configuration/database.config');
const { findAll, findByAttendanceTime, findByLeaveTime } = require('../repository/user');

const TIME_FORMAT = 'HH:mm';

/**
 * 1. 공유일 확인(TODO)
 * 2. 해당 시간에 출근하는 사람 확인해서 대기열 추가(TODO: 휴가제외)
 * 3. 해당 시간에 퇴근하는 사람 확인해서 대기열 추가(TODO: 휴가제외)
 * 4. 150명씩(max support) 나눠서 메시지 전송
 * 5. 10분, 15분, 30분뒤 다시 알림(TODO)
 */
exports.attendanceJob = () => {
    const ALARM_BEFORE = 10;
    schedule.scheduleJob('50 12 * * 1', () => {
        pool.query(findAll())
        .then(result => multicastUsers(extractUserIds(result),'췍! 출근하셨다면 출근버튼을 꼭 눌러주세요~'))
        .then(responses => console.log('Attendance alarm succeed'))
        .catch(err => console.error(err.stack));
    });

    schedule.scheduleJob('20,50 * * * 2-5', () => {
        const queryTime = moment().add(ALARM_BEFORE, 'minutes').format(TIME_FORMAT);
        pool.query(findByAttendanceTime(queryTime))
            .then(result => multicastUsers(extractUserIds(result),'췍! 출근하셨다면 출근버튼을 꼭 눌러주세요~'))
            .then(responses => console.log('Attendance alarm succeed'))
            .catch(err => console.error(err.stack));
    });
}

exports.leaveJob = () => {
    schedule.scheduleJob('0,30 * * * 1-5', () => {
        const queryTime = moment().format(TIME_FORMAT);
        pool.query(findByLeaveTime(queryTime))
            .then(result => multicastUsers(extractUserIds(result), '오늘 하루도 우아했나요? 퇴근하시기 전에 퇴근버튼 꾹! 잊지마세요~'))
            .then(responses => console.log('Leave alarm succeed'))
            .catch(err => console.error(err.stack));
    });
}

function extractUserIds(result) {
    return result.rows.map(user => user['user_id']);
}

function multicastUsers(userIds, text) {
    if (userIds.length === 0) {
        console.log('No user');
        return;
    }

    const requests = [];
    const maxTry = parseInt(userIds.length / REQUEST_THRESHOLD + 1);

    for (let i = 0; i < maxTry; i++) {
        const slice = userIds.slice(i * REQUEST_THRESHOLD, (i + 1) * REQUEST_THRESHOLD);
        requests.push(multicastMessage(slice, text));
    }

    return Promise.all(requests);
}