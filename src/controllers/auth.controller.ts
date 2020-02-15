import { Request, Response, NextFunction } from "express";

import ee, { EVENTS } from 'lib/utils/ee';
import { createToken, createEphemeralToken, verifyEphemeralToken } from 'lib/utils/jwt';
import * as userService from 'services/user.service';

import {
  BadUserInputError,
  UserNotFoundError,
  UserNotAuthorizedError,
  UsedEntityError,
  catchErrors,
  InvalidTokenError
} from 'lib/errors';

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
      password,
      active: false
    });
  } catch(err) {
    throw new UsedEntityError(`Username or email already in use`);
  }

  const token = createEphemeralToken({ username: user.username, email: user.email, password: user.password});
  ee.emit(EVENTS.user.signUp, { username: user.username, email: user.email, password: user.password, token })
  res.status(201).send(user.toResponseObject());
});

export const activate = async (req: Request, res: Response, _: NextFunction) => {
    const token = req.params.token;
    let payload;
    try {
        payload = verifyEphemeralToken(token)
    } catch(err) {
        throw new InvalidTokenError();
    }
    const user = await userService.find({ where: { username: payload.username } });
    if (!user) {
      throw new UserNotFoundError();
    }

    user.active = true;
    const isSaved = await user.save();
    if (isSaved) {
      return res.send(`Hey ${user.username}! You can use attic now`);
    }
    return res.send(`Hey ${user.username}! We've met with an error while updating yourr details. Please try again!`);
}

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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

    //Get user from the database
  const user = await userService.find({ where: { email }});
    if (!user) {
      next(new UserNotFoundError());
  }
  const token = createEphemeralToken({ username: user.username, email: user.email, password: user.password});

  user.resetPasswordToken = token;
  const isUpdated = await user.save();
  if (isUpdated) {
    ee.emit(EVENTS.user.resetPassword, { username: user.username, email: user.email, password: user.password, token })
    return res.send(`Hey ${user.username}! Email has been sent to ${user.email}. Follow the instruction to activate your account`);
  }
  res.send('Errorr!')
};

export const resetPassword = async (req: Request, res: Response, _: NextFunction) => {
  const { resetPasswordToken, newPassword } = req.body;

  if (resetPasswordToken) {
    let payload;
    try {
        payload = verifyEphemeralToken(resetPasswordToken)
    } catch(err) {
        throw new InvalidTokenError(`Expired link. Try again`);
    }
    const user = await userService.find({ where: { username: payload.username } });
    if (!user) {
      throw new UserNotFoundError();
    }

    user.password = newPassword;
    user.resetPasswordToken = '';
    const isUpdated = await user.save();
    if (isUpdated) {
      return res.send(`Hey ${user.username}! You can use attic now`);
    }
    return res.send(`Hey ${user.username}! We've met with an error while updating yourr details. Please try again!`);
  } else {
    return res.send(`Hey, the token seems missing in the call!`);
  }
};
