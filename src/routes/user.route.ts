import express from 'express';
import AuthController from '../controllers/auth.controller';

const userRouter = express.Router();

userRouter.post("/auth/login", AuthController.login);

export default userRouter;