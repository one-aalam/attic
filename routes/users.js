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

const file = require('../lib/file');
const generateId = require('../lib/generate-id');
const NotFound = require('../lib/not-found-err');
const NotFounder = require('../lib/not-found-handler');

const dataPath = './fixtures/users.json';

const getUser = async(req, res) => {
    const users = await file.read(dataPath);
    const  user = users.find(user => user.id === req.params.id);
    if (!user) {
        throw new NotFound();
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
    if (!user) {
        throw new NotFound();
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
    if (!user) {
        throw new NotFound();
    }
    const updUsers = users.filter(user => user.id !== req.params.id);
    await file.write(JSON.stringify(updUsers, null, 2), dataPath);
    res.sendStatus(204);
}

const userRoutes = (app) => {

    router.get('/', getUsers); // GET ALL
    router.post('/', bodyParser, upload.array('avatar'), createUser); // CREATE

    router.get('/:id', getUser, NotFounder); // GET
    router.patch('/:id', bodyParser, upload.array('avatar'), updateUser, NotFounder ); // UPDATE
    router.delete('/:id', deleteUser, NotFounder); // DELETE

    app.use('/users', router);
};

module.exports = userRoutes;