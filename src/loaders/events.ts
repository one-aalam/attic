import EE, { EVENTS } from 'lib/utils/ee';
import { sendAccountActivationEmail, sendResetPasswordEmail  } from 'services/mailer.service';


EE.on(EVENTS.user.signUp, sendAccountActivationEmail)
EE.on(EVENTS.user.resetPassword, sendResetPasswordEmail)
