const basicAuth = finderFn => async (req, res, next) => {
    const header = req.headers.authorization || '';
    const [ type, payload ] = header.split(' ');
    if (type === 'Basic') {
        const credentials = Buffer.from(payload, 'base64').toString('ascii');
        const [ username, password ] = credentials.split(':');
        const user = await finderFn({ username, password });
        if (user) {
            req.user = user;
        } else {
            res.sendStatus(401);
            return;
        }
    }
    // 'Basic' has one responsibility: to verify “Basic” credentials. It shouldn’t also have the responsibility
    // of blowing up if none are included!
    next();
}

module.exports = basicAuth;