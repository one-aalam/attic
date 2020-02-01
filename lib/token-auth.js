const jwt = require('jsonwebtoken');
const jwtSecretKey = '1m_s3cure';

const tokenAuth = finderFn => async(req, res, next) => {
    const header = req.headers.authorization || ''; // @TODO: req.cookies.token
    const [ type, token ] = header.split(' ');
    if (type === 'Bearer') {
        let payload;
        try {
            payload = jwt.verify(token, jwtSecretKey);
        } catch(err) {
            res.sendStatus(401);
            return;
        }
        const user = await finderFn(payload);
        req.user = user;
    }
    // 'Bearer' has one responsibility: to verify Bearer credentials. It shouldn’t also have the responsibility
    // of blowing up if none are included!
    next();
}

module.exports = tokenAuth;