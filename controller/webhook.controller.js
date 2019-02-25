const { pushMessage } = require('../configuration/line.config');
const { pool } = require('../configuration/database.config');
const { findById, insertUser, activateUser, deleteUser } = require('../repository/user');

exports.webhookHealth = (req, res) => {
    res.sendStatus(200);
};

exports.webhookHandler = (req, res) => {
    const events = req.body.events;
    events.map(event => {
        console.log(event);
        const { type, source } = event;
        switch (type) {
            case 'follow':
                createFollowUser(source, res);
                break;
            case 'unfollow':
                deleteUnfollowUser(source, res);
                break;
            case 'message': 
                replyMessage(source, res);
                break;
            default:
                res.sendStatus(200);
                break;
        }
    });
};

function createFollowUser(source, res) {
    if (source.type !== 'user') {
        return;
    }

    const userId = source.userId;
    pool.query(findById(userId))
        .then(result => {
            const userQuery = result.rows.length ? activateUser : insertUser;
            return pool.query(userQuery(userId)).then(result => greeting(userId));
        })
        .then(response => res.sendStatus(200))
        .catch(err => defaultErrorHandler(err, res));
}

function deleteUnfollowUser(source, res) {
    const userId = source.userId;
    pool.query(deleteUser(userId))
        .then(result => res.sendStatus(200))
        .catch(err => defaultErrorHandler(err, res));
}

function replyMessage(source, res) {
    pushMessage(source.userId, '현재 대화기능은 제공하고 있지 않습니다')
    .then(response => res.sendStatus(200)).catch(err => defaultErrorHandler(err, res));
}

function greeting(userId) {
    return pushMessage(userId, '친구추가 해주셔서 감사합니다!');
}

function defaultErrorHandler(error, res) {
    console.error(error.stack);
    return res.sendStatus(500);
}