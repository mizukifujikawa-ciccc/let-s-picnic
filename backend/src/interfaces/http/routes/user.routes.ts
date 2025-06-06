import { Router } from "express";
import { UserService } from "../../../application/service/user.service";
import userRepository from "../../../infrastructure/repositories/user.repository";
import { createUserController } from "../controllers/user.controller";

const userRouter = Router()

const userService = new UserService(userRepository);
const userController = createUserController(userService);

userRouter.get('/', userController.getAllUsers) // ok http://localhost:3000/user/
userRouter.post('/signup', userController.addUser) // ok
userRouter.post('/login', userController.loginUser) // ok http://localhost:3000/user/login
userRouter.get('/logout', userController.logoutUser) // ok
userRouter.get('/check-cookie', userController.checkCookie) //ok
userRouter.get('/:userId', userController.getUserById) // ok http://localhost:3000/user/3
userRouter.put('/:userId', userController.editUser) // ok http://localhost:3000/user/4
userRouter.delete('/:userId', userController.deleteUser) // ok

export default userRouter

