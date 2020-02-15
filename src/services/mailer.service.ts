import mailer from 'lib/utils/mailer';
import config from 'config';

export const sendAccountActivationEmail = async (options: any) => {
    await mailer.sendMail({
        from: config.emailFrom,
        to: options.email,
        subject: 'Hiya! welcome to Attic - Activation Link',
        text: `Hey there, it’s nice to see you here ;). Please use the link to activate your acccount`,
        html: `<b>Hey ${options.username}! </b><br> it’s nice to see you here ;)

          <h1>You're just one step away from being a proud Attic member!</h1>
          <p>Please visit <a href="${config.clientUrl}/auth/activate/${options.token}">${config.clientUrl}/auth/activate/${options.token.substr(0, 12)}...</a> to activate your account</p>

          Thanks,
          Team Attic
        `
      }, (error: any, info: any) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      })
};

export const sendResetPasswordEmail = async (options: any) => {
    await mailer.sendMail({
        from: config.emailFrom,
        to: options.email,
        subject: 'Hiya! welcome to Attic - Password Rest Link',
        text: `Hey there, Please use the link to reset your acccount's password`,
        html: `<b>Hey ${options.username}! </b>

          <h1>Please use the link to reset your acccount's password!</h1>
          <p>Please visit <a href="${config.clientUrl}/auth/password/reset/${options.token}">${config.clientUrl}/auth/password/reset/${options.token.substr(0, 12)}...</a> to activate your account</p>

          Thanks,
          Team Attic
        `
      }, (error: any, info: any) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      })
};
