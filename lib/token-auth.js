const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

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