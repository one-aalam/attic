const router = require('express').Router();
const file = require('../lib/file');
const jsonBodyParser = require('../lib/json-body-parser');
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
    const newUser = { id, ...req.body };
    await file.write(JSON.stringify([ ...users, newUser], null, 2), dataPath);
    res.status(201).send(newUser);
}

const updateUser = async(req, res) => {
    const users = await file.read(dataPath);
    const user = users.find(user => user.id === req.params.id);
    if (!user) {
        throw new NotFound();
    }
    const updUsers = users.filter(user => user.id !== req.params.id);
    const updUser = { ...user, ...req.body, id: user.id };
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
    router.post('/', jsonBodyParser, createUser); // CREATE

    router.get('/:id', getUser, NotFounder); // GET
    router.patch('/:id', jsonBodyParser, updateUser, NotFounder ); // UPDATE
    router.delete('/:id', deleteUser, NotFounder); // DELETE

    app.use('/users', router);
};

module.exports = userRoutes;