const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser').json({
    limit: '100kb'
});

const findUsers = require('../lib/find-users');
const requireAuth = require('../lib/require-auth');

const jwtSecretKey = '1m_s3cure';
const jwtExpiresIn = 24 * 60 * 60 * 1000 ;


const createToken = user => jwt.sign({ id: user.id, name: user.name }, jwtSecretKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpiresIn
});

const createTokenRoute = async(req, res) => {
    const { username , password } = req.body;
    const user = await findUsers.byNameAndPassword({ username, password });
    if (user) {
        const token = createToken(user);
        // res.cookie('token', token, { maxAge: jwtExpiresIn });
        // res.set('Authorization', `Bearer ${token}`);
        res.status(201).send(token);
    } else {
        res.sendStatus(422); // Unprocessable entity
    }
}

const tokenRoutes = (app) => {
    router.post('/', bodyParser, createTokenRoute);
    router.get('/me', requireAuth, (req, res) => res.send(req.user));

    app.use('/tokens', router);
};

module.exports = tokenRoutes;