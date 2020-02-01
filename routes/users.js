const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser').json({
    limit: '100kb'
});
const storage = multer.diskStorage({
    destination: function (_, _, cb) {
      cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (_, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});
const upload = multer({ storage });

const requireAuth = require('../lib/require-auth');
const enforce = require('../lib/enforce');
const file = require('../lib/file');
const generateId = require('../lib/generate-id');
const { NotFoundError } = require('../lib/custom-error');
const { notFoundHandler, notAuthorizedHandler } = require('../lib/custom-error-handler');

const dataPath = './fixtures/users.json';

const getUser = async(req, res) => {
    const users = await file.read(dataPath);
    const  user = users.find(user => user.id === req.params.id);
    if (!user) {
        throw new NotFoundError();
    }
    res.send(user);
};

const getUsers = async(req, res) => {
    const users = await file.read(dataPath);
    res.send(users);
};

const createUser = async(req, res) => {
    const users = await file.read(dataPath);
    const id = generateId();
    const avatar = (req.files || []).map(file => `/uploads/${file.filename}`);
    const newUser = { id, ...req.body, avatar };
    await file.write(JSON.stringify([ ...users, newUser], null, 2), dataPath);
    res.status(201).send(newUser);
}

const updateUser = async(req, res) => {
    const users = await file.read(dataPath);
    const user = users.find(user => user.id === req.params.id);
    req.authorize(user);
    if (!user) {
        throw new NotFoundError();
    }
    const avatar = (req.files || []).map(file => `/uploads/${file.filename}`);
    const updUsers = users.filter(user => user.id !== req.params.id);
    const updUser = { ...user, ...req.body, id: user.id, avatar };
    await file.write(JSON.stringify([...updUsers, updUser], null, 2), dataPath);
    res.status(200).send(updUser);
}

const deleteUser = async(req, res) => {
    const users = await file.read(dataPath);
    const user = users.find(user => user.id === req.params.id);
    req.authorize(user);
    if (!user) {
        throw new NotFoundError();
    }
    const updUsers = users.filter(user => user.id !== req.params.id);
    await file.write(JSON.stringify(updUsers, null, 2), dataPath);
    res.sendStatus(204);
}


const updateUserPolicy = (user, resource) => user.id === resource.id;
const deleteUserPolicy = updateUserPolicy;


const userRoutes = (app) => {
    router.use(requireAuth);

    router.get('/', getUsers); // GET ALL
    router.post('/', bodyParser, upload.array('avatar'), createUser); // CREATE

    router.get('/:id', getUser, notFoundHandler); // GET
    router.patch('/:id', enforce(updateUserPolicy), bodyParser, upload.array('avatar'), updateUser, notAuthorizedHandler, notFoundHandler ); // UPDATE
    router.delete('/:id', enforce(deleteUserPolicy), deleteUser, notAuthorizedHandler, notFoundHandler); // DELETE

    app.use('/users', router);
};

module.exports = userRoutes;