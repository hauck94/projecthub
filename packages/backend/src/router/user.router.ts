import { Router } from 'express';
import { deleteUserById, getUsers, getUserById, updateUserById, registerNewUser, logInUser} from '../controller/user.controller';
import { logTime } from '../middleware/loggerAccess';

export const userRouter = Router({ mergeParams: true });

// GET Tbl Label
userRouter.get('/', getUsers);
// GET Tbl Label by ID
userRouter.get('/:userId', getUserById);
// Register User
userRouter.post('/', registerNewUser);
// Login Token
userRouter.post('/login',logTime, logInUser);
// DELETE User by ID
userRouter.delete('/:userId', deleteUserById);
// UPDATE User by ID
userRouter.patch('/:userId', updateUserById);