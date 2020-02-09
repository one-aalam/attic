import { Request, Response, NextFunction } from "express";
import { createToken } from 'lib/utils/jwt';

import * as userService from 'services/user.service';
import { BadUserInputError, UserNotFoundError, UserNotAuthorizedError, UsedEntityError, catchErrors } from 'lib/errors';


export const login = async (req: Request, res: Response, next: NextFunction) => {

    let { username, password } = req.body;
      if (!(username && password)) {
        return next(new BadUserInputError({ fieldKeys: [
          !username && 'username',
          !password && 'password'
        ].filter(val => val !== false)
      }));
    }

    const user = await userService.find({ where: { username } });
    if (!user) {
      return next(new UserNotFoundError());
    }

    const isPasswordValid = await user?.comparePassword(password)
    if (!isPasswordValid) {
      return next(new UserNotAuthorizedError())
    }

    const token = createToken({
        userId: user?.id,
        username: user?.username,
        roles: user?.roles
    });
    res.locals.jwtPayload = {
      id: user?.id
    };
    res.set('Authorization', `Bearer ${token}`);
    res.status(201).send(token);
};

export const register = catchErrors(async (req: Request, res: Response, next: NextFunction) => {

  let { username, email, password } = req.body;
    if (!(username && email &&  password)) {
      return next(new BadUserInputError({ fieldKeys: [
        !username && 'username',
        !email && 'email',
        !password && 'password'
      ].filter(val => val !== false)
    }));
  }

  let user;
  try {
    user = await userService.create({
      username,
      email,
      password
    });
  } catch(err) {
    throw new UsedEntityError(`Username or email already in use`);
  }

  res.status(201).send(user.toResponseObject());
});

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  //Get ID from JWT
  const id = res.locals.jwtPayload.userId;

  //Get parameters from the body
  const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      next(new BadUserInputError({ fieldKeys: [
        !oldPassword && 'oldPassword',
        !newPassword && 'newPassword',
      ].filter(val => val !== false)
    }));
  }

  //Get user from the database
  const user = await userService.find({ where: { id }});
  if (!user) {
    next(new UserNotFoundError());
  }

  //Check if old password matchs
  const isPasswordValid = await user?.comparePassword(oldPassword)
  if (!isPasswordValid) {
    next(new UserNotAuthorizedError())
  }

  //Validate de model (password lenght)
  // TODO: Do pasword strictness validation
  await userService.update(id, {
    password: newPassword
  });
  res.status(204).send();
};
