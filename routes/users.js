const router = require('express').Router();
const file = require('../lib/file');
const readBody = require('../lib/read-body');
const dataPath = './fixtures/users.json';

const getUser = async(req, res) => {
    const users = await file.read(dataPath);
    const  user = users.find(user => user.id == req.params.id);
    res.send(user);
};

const getUsers = async(req, res) => {
    const users = await file.read(dataPath);
    res.send(users);
};

const createUser = async(req, res) => {
    const users = await file.read(dataPath);
    const id = users.length + 1;
    const body = await readBody(req);
    const newUser = { ...JSON.parse(body), id };
    await file.write(JSON.stringify([ ...users, newUser], null, 2), dataPath);
    res.status(201).send(newUser);
}

const updateUser = async(req, res) => {
    const users = await file.read(dataPath);
    const user = users.find(user => user.id == req.params.id);
    const updUsers = users.filter(user => user.id != req.params.id);
    const body = await readBody(req);
    const updUser = { ...user, ...JSON.parse(body), id: user.id };
    await file.write(JSON.stringify([...updUsers, updUser], null, 2), dataPath);
    res.status(200).send(updUser);
}

const deleteUser = async(req, res) => {
    const users = await file.read(dataPath);
    const updUsers = users.filter(user => user.id != req.params.id);
    await file.write(JSON.stringify(updUsers, null, 2), dataPath);
    res.sendStatus(204);
}

const userRoutes = (app) => {

    router.get('/', getUsers); // GET ALL
    router.post('/', createUser); // CREATE

    router.get('/:id', getUser); // GET
    router.patch('/:id', updateUser); // UPDATE
    router.delete('/:id', deleteUser); // DELETE

    app.use('/users', router);
};

module.exports = userRoutes;