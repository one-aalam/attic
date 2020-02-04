import express, { Express, Request, Response, Router } from 'express';
import bodyParse from 'body-parser';

import { IUserRequest } from 'interfaces';

import * as findUsers from 'lib/find-users';
import { requireAuth } from 'lib/require-auth';
import { createToken } from 'lib/jwt';

const router: Router = express.Router();

const bodyParser = bodyParse.json({
  limit: '100kb',
});

// const createToken = (user: IUser) =>
//   jwt.sign({ id: user.id, name: user.name }, jwtSecretKey as string, {
//     algorithm: 'HS256',
//     expiresIn: jwtExpiresIn,
//   });

const createTokenRoute = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await findUsers.byNameAndPassword({ username, password });
  if (user) {
    const token = createToken(user);
    // res.cookie('token', token, { maxAge: jwtExpiresIn });
    res.set('Authorization', `Bearer ${token}`);
    res.status(201).send(token);
  } else {
    res.sendStatus(422); // Unprocessable entity
  }
};

export const tokenRoutes = (app: Express): void => {
  router.post('/', bodyParser, createTokenRoute);
  router.get('/me', requireAuth, (req: IUserRequest, res: Response) => res.send(req.user));

  app.use('/tokens', router);
};
