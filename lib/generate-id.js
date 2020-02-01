const crypto = require('crypto');

const generateId = () => crypto.randomBytes(8).toString('hex');

module.exports = generateId;