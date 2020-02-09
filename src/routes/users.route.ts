import { Router } from 'express';
import * as userController from 'controllers/user.controller';
import { __PROTECTED, __POST_OWNER, __OWNER, __ADMIN, __POST_ADMIN } from './middleware.preset';
import validate from 'lib/middlewares/validate'
import User from 'entities/user.entity';


const router: Router = Router();

router.use(__PROTECTED);

router.get('/', __ADMIN, userController.getAll); // GET ALL
router.post('/', __POST_ADMIN, validate(User), userController.createUser); // CREATE

router.get('/:id', userController.getOne); // GET
router.patch('/:id', __POST_OWNER, userController.updateUser); // UPDATE
router.delete('/:id', __OWNER, userController.deleteUser); // DELETE

export default router;
