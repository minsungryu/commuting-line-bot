const schedule = require('node-schedule');
const moment = require('moment');

const { multicastMessage, REQUEST_THRESHOLD } = require('../configuration/line.config')
const { pool } = require('../configuration/database.config');
const { findByAttendanceTime, findByLeaveTime } = require('../repository/user');

/**
 * 1. 공유일 확인(TODO)
 * 2. 해당 시간에 출근하는 사람 확인해서 대기열 추가(TODO: 휴가제외)
 * 3. 해당 시간에 퇴근하는 사람 확인해서 대기열 추가(TODO: 휴가제외)
 * 4. 150명씩(max support) 나눠서 메시지 전송
 * 5. 10분, 15분, 30분뒤 다시 알림(TODO)
 */
exports.woowaAttendanceJob = () => {
    const ALARM_BEFORE = 10;

    // schedule.scheduleJob('20,50 * * * 1-5', () => {
    schedule.scheduleJob('* * * * *', () => {
        const queryTime = moment().add(10, 'minutes').format('HH:mm');
        pool.query(findByAttendanceTime(queryTime))
            .then(result => {
                const userIds = result.rows.map(user => user['user_id']);

                if (userIds.length === 0) {
                    console.log('No user to attendance');
                    return;
                }

                const requests = [];
                const maxTry = parseInt(userIds.length / REQUEST_THRESHOLD + 1);

                for (let i = 0; i < maxTry; i++) {
                    const slice = userIds.slice(i * REQUEST_THRESHOLD, (i + 1) * REQUEST_THRESHOLD);
                    requests.push(multicastMessage(slice, '췍! 출근하셨다면 출근버튼을 꼭 눌러주세요~'));
                }

                return Promise.all(requests);
            })
            .then(responses => {
                console.log('responses', responses);
                console.log(`Attendance alarm succeed`);
            })
            .catch(err => {
                console.error(err.stack);
            });
    });
}

exports.woowaLeaveJob = () => {
    // schedule.scheduleJob('0,30 * * * 1-5', () => {
    schedule.scheduleJob('* * * * *', () => {
        const queryTime = moment().format('HH:mm');
        pool.query(findByLeaveTime(queryTime))
            .then(result => {
                const userIds = result.rows.map(user => user['user_id']);

                if (userIds.length === 0) {
                    console.log('No user to leave');
                    return;
                }

                const requests = [];
                const maxTry = parseInt(userIds.length / REQUEST_THRESHOLD + 1);

                for (let i = 0; i < maxTry; i++) {
                    const slice = userIds.slice(i * REQUEST_THRESHOLD, (i + 1) * REQUEST_THRESHOLD);
                    requests.push(multicastMessage(slice, '오늘 하루도 우아했나요? 퇴근하시기 전에 퇴근버튼 꾹! 잊지마세요~'));
                }

                return Promise.all(requests);
            })
            .then(responses => {
                console.log('responses', responses);
                console.log(`Leave alarm succeed`);
            })
            .catch(err => {
                console.error(err.stack);
            });
    });
}