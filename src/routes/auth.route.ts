import { Router } from 'express';
import { bodyParser } from './middleware.preset';
import  * as authController from 'controllers/auth.controller';

const router: Router = Router();

// Account Registration, Activation and logins
router.post('/login', [ bodyParser ], authController.login); // login
router.post('/register', [ bodyParser ], authController.register); // register
router.get('/activate/:token', authController.activate); // register
// Forgot & Reset password
router.put('/forgot-password', [ bodyParser ] , authController.forgotPassword);
router.put('/reset-password', [ bodyParser ], authController.resetPassword);
// Google, Facebook, etc.
router.post('/google-login', [ bodyParser ] , authController.googleLogin);
router.post('/facebook-login', [ bodyParser ], authController.facebookLogin);


export default router;