import { Router } from 'express';
import bodyParse from 'body-parser';

import  * as authController from 'controllers/auth.controller';

const router: Router = Router();
const bodyParser = bodyParse.json({
    limit: '100kb',
});


router.post('/login', [ bodyParser ], authController.login); // login
router.post('/register', [ bodyParser ], authController.register); // register


export default router;