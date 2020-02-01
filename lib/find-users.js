const path = require('path');
const file = require('./file');

const dataPath = path.join(__dirname, '../fixtures/users.json');

const findUserByNameAndPassword  = async ({ username, password }) => {
    const users = await file.read(dataPath);
    return users.find(user => user.name === username && user.password === password);
}

const findUserById  = async ({ id }) => {
    const users = await file.read(dataPath);
    return users.find(user => user.id === id);
}

exports.byNameAndPassword = findUserByNameAndPassword;
exports.byUserId = findUserById;
exports.byUserToken = findUserById;