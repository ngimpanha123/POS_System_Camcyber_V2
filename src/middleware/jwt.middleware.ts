import { Request, Response, NextFunction } from "express";
import responseError from "../shared/error.res";
import UserPayload from "../shared/interfaces/user-payload.interface";
import * as jwt from 'jsonwebtoken';
import jwtConstants from "../../utils/constants";
import User from "../models/user.model";

const JWTAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Authorization token is missing or not in the correct format.');
        }
        const token: string = authorizationHeader.split('Bearer ')[1];
        let payload: UserPayload;
        try {
            payload = jwt.verify(token, jwtConstants.secret) as UserPayload;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Authorization token is expired.');
            }
            throw new Error('Authorization token is invalid.');
        }
        const userId = payload?.user?.id;
        if (!userId) {
            throw new Error('User ID not found in token payload.');
        }
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        res.locals.user = user;
        next();
    } catch (error) {
        return responseError(res, 401, error.message ?? 'Authorization failed!. Invalid request');
    }
}

export default JWTAuthorization;