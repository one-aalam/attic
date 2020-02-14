import { Request, Response, NextFunction } from "express";

import config from 'config';
import { createToken, createEphemeralToken, verifyEphemeralToken } from 'lib/utils/jwt';
import mailer from 'lib/utils/mailer';

import * as userService from 'services/user.service';
import { BadUserInputError, UserNotFoundError, UserNotAuthorizedError, UsedEntityError, catchErrors, InvalidTokenError } from 'lib/errors';

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
  // https://blog.mailtrap.io/sending-emails-with-nodemailer/
  await mailer.sendMail({
    from: '"Attic Team" <from@attic-server.com>',
    to: email,
    subject: 'Hiya! welcome to Attic - Activation Link',
    text: `Hey there, it’s nice to see you here ;). Please use the link to activate your acccount`,
    html: `<b>Hey ${user.username}! </b><br> it’s nice to see you here ;)

      <h1>You're just one step away from being a proud Attic member!</h1>
      <p>Please visit <a href="${config.clientUrl}/auth/activate/${token}">${config.clientUrl}/auth/activate/${token.substr(0, 12)}...</a> to activate your account</p>

      Thanks,
      Team Attic
    `
  }, (error: any, info: any) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  })
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
    return res.send(`Hey ${user.username}! You can use attic now`);
  }

  await mailer.sendMail({
    from: '"Attic Team" <from@attic-server.com>',
    to: email,
    subject: 'Hiya! welcome to Attic - Password Rest Link',
    text: `Hey there, Please use the link to reset your acccount's password`,
    html: `<b>Hey ${user.username}! </b>

      <h1>Please use the link to reset your acccount's password!</h1>
      <p>Please visit <a href="${config.clientUrl}/auth/password/reset/${token}">${config.clientUrl}/auth/password/reset/${token.substr(0, 12)}...</a> to activate your account</p>

      Thanks,
      Team Attic
    `
  }, (error: any, _info: any) => {
    if (error) {
          return res.json({
            message: error.message
          });
    }
    return res.json({
      message: `Email has been sent to ${email}. Follow the instruction to activate your account`
    });
  })
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
