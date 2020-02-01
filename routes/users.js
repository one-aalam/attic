const router = require('express').Router();
const file = require('../utils/file');
const dataPath = './fixtures/users.json';

const userRoutes = (app) => {
    // READ
    router.get('/', (_, res) => file.read(data => res.send(data), true, dataPath));

    // CREATE
    router.post('/', (req, res) => {
        file.read(users => {
            const id = users.length + 1;
            file.write(JSON.stringify([ ...users, { ...req.body, id }], null, 2), () => res.status(200).send(`new user ${newUserId} added`), dataPath);
        },true, dataPath);
    });

    // UPDATE
    router.put('/:id', (req, res) => {
        file.read(users => {
            const  user = users.find(user => user.id === req.params.id);
            const updUsers = users.filter(user => user.id !== req.params.id);
            file.write(JSON.stringify([...updUsers, {...user, ...req.body }], null, 2), () => res.status(200).send(`users id:${userId} updated`), dataPath);
        }, true, dataPath);
    });

    // DELETE
    router.delete('/:id', (req, res) => {
        file.read(users => {
            const newUsers = users.filter(user => user.id !== req.params.id);
            file.write(JSON.stringify(newUsers, null, 2), () => res.status(200).send(`users id:${req.params.id} removed`), dataPath);
        }, true, dataPath);
    });
    app.use('/users', router);
};

module.exports = userRoutes;